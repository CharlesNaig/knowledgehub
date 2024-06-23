<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Send email using PHP mail function
    $to = "elixirdevelopmentbot@gmail.com";
    $subject = "Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nMessage: $message";

    if (mail($to, $subject, $body)) {
      echo "Message sent successfully!";
    } else {
      echo "Error sending message: " . error_get_last()['message'];
    }
  }
?>