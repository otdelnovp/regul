<?php

  define('FROM', 'luzifiero@gmail.com');
  define('TO', 'luzifiero@gmail.com, luzifiero@yandex.ru, rolandvermin@mail.ru');
  define('COMPANY', 'Столичная рента');
  define('DEFAULT_HEADER', 'Письмо с посадочной страницы &laquo;Столичная рента&raquo;');
  
  include 'mailsend.php';

  $url = 'http://'.$_SERVER['SERVER_NAME'];

  $id = isset($_POST['id']) ? $_POST['id'] : null;
  $name = isset($_POST['name']) ? $_POST['name'] : null;
  $phone = isset($_POST['phone']) ? $_POST['phone'] : null;
  $email = isset($_POST['email']) ? $_POST['email'] : null;
  $msg = isset($_POST['msg']) ? $_POST['msg'] : null;

  $header = isset($_POST['header']) ? $_POST['header'] : DEFAULT_HEADER;
  $subHeader = isset($_POST['subHeader']) ? $_POST['subHeader'] : null;
  $comment = isset($_POST['comment']) ? $_POST['comment'] : null;

  $messageHtml = '
      <html> 
          <head><title>'.$header.'</title></head>
      <body>
          <h1>'.$header.'</h1>
          <h2>'.$subHeader.'</h2>
          <p>'.$comment.'</p>';

          // Text before data table
          $messageHtml .= '';

          // Order table html
          $messageHtml .= '<br /><table>';

          if(isset($id) && $id !== null) { $messageHtml .= '<tr><td width="300">Идентификатор формы: </td><td>'.$id.'</td></tr>'; }
          if(isset($name) && $name !== null) { $messageHtml .= '<tr><td width="300">Имя: </td><td>'.$name.'</td></tr>'; }
          if(isset($phone) && $phone !== null) { $messageHtml .= '<tr><td width="300">Телефон: </td><td>'.$phone.'</td></tr>'; }
          if(isset($email) && $email !== null) { $messageHtml .= '<tr><td width="300">E-mail: </td><td>'.$email.'</td></tr>'; }
          if(isset($msg) && $msg !== null) { $messageHtml .= '<tr><td width="300">Сообщение: </td><td>'.$msg.'</td></tr>'; }

          $messageHtml .= '<tr><td width="300">Дата отправки:</td><td>'.date('d.m.Y H:i').'</td></tr>';

          $messageHtml .= '</table><br />';
          // End order table html

          // Text after data table
          $messageHtml .= '';

          $messageHtml .= '</body></html>';

  $mail = new Mail(FROM); // Create an instance of class
  $mail->setFromName(COMPANY); // Set up a name in the return address

  $response = Array(

    'fields' => $mail->send(TO, $header, $messageHtml),
    'hideForm' => true,

    'msg' => '
        <h3>Спсаибо!</h3>
        <p>Ваше сообщение отправлено!</p>
    '

  );

  if ($response['fields']) {

      // Success message

      $response['msg'] = '
        <h3>Спасибо!</h3>
        <p>Ваше сообщение отправлено!</p>
      ';

  } else {

      // Error message

      $response['msg'] = '
        <h6>Ошибка!</h6>
        <p>Попробуйте еще раз!</p>
      ';

  }

  sleep(1);

  echo json_encode($response);

?>