<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'lessonType', 'clientType', 'message', 'recaptcha'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Pole '$field' je povinné"]);
        exit;
    }
}

// Verify reCAPTCHA
$recaptcha_secret = 'YOUR_RECAPTCHA_SECRET_KEY'; // Replace with your actual secret key
$recaptcha_response = $input['recaptcha'];

$recaptcha_verify_url = 'https://www.google.com/recaptcha/api/siteverify';
$recaptcha_data = [
    'secret' => $recaptcha_secret,
    'response' => $recaptcha_response,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];

$recaptcha_options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($recaptcha_data)
    ]
];

$recaptcha_context = stream_context_create($recaptcha_options);
$recaptcha_result = file_get_contents($recaptcha_verify_url, false, $recaptcha_context);
$recaptcha_json = json_decode($recaptcha_result, true);

if (!$recaptcha_json['success']) {
    http_response_code(400);
    echo json_encode(['error' => 'reCAPTCHA ověření selhalo']);
    exit;
}

// Sanitize input data
$name = htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$lesson_type = $input['lessonType'] === 'online' ? 'Online výuka' : 'Prezenční výuka';
$client_type = $input['clientType'] === 'individual' ? 'Jednotlivec' : 'Firma';
$message = htmlspecialchars($input['message'], ENT_QUOTES, 'UTF-8');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Neplatný email format']);
    exit;
}

// Email configuration
$to = 'kontakt@gmail.com'; // Replace with your actual email
$subject = 'Nový dotaz z kontaktního formuláře - ' . $client_type;

// Email body
$email_body = "
<html>
<head>
    <meta charset='UTF-8'>
    <title>Nový dotaz z webu</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
        <h2 style='color: #4a4a4a; border-bottom: 2px solid #4a4a4a; padding-bottom: 10px;'>
            Nový dotaz z kontaktního formuláře
        </h2>
        
        <div style='background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;'>
            <p><strong>Kontaktní jméno:</strong> $name</p>
            <p><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
            <p><strong>Typ výuky:</strong> $lesson_type</p>
            <p><strong>Typ klienta:</strong> $client_type</p>
        </div>
        
        <div style='margin: 20px 0;'>
            <h3 style='color: #4a4a4a;'>Zpráva:</h3>
            <div style='background: #fff; padding: 15px; border-left: 4px solid #4a4a4a; border-radius: 0 5px 5px 0;'>
                " . nl2br($message) . "
            </div>
        </div>
        
        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666;'>
            <p>Tento email byl odeslán z kontaktního formuláře na webu dne " . date('d.m.Y H:i:s') . "</p>
            <p>IP adresa odesílatele: " . $_SERVER['REMOTE_ADDR'] . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $name . ' <' . $email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Send email
if (mail($to, $subject, $email_body, implode("\r\n", $headers))) {
    echo json_encode(['success' => true, 'message' => 'Email byl úspěšně odeslán']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba při odesílání emailu']);
}
?>