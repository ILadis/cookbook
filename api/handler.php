<?php
namespace Http\Handler;
use Http\Handler as HttpHandler;

class ServeRedirect implements HttpHandler {
  private $location;

  public function __construct($location) {
    $this->location = $location;
  }

  public function handle($request, $response) {
    $response->setStatus(301);
    $response->setHeader('Location', $this->location);
  }
}

class ServeFile implements HttpHandler {
  private $file;
  private static $types = array(
    'html' => 'text/html',
    'css'  => 'text/css',
    'js'   => 'text/javascript',
    'svg'  => 'image/svg+xml',
    'png'  => 'image/png',
    'json' => 'application/json',
    'webmanifest' => 'application/manifest+json',
  );

  public function __construct($file) {
    $this->file = $file;
  }

  public function handle($request, $response) {
    $file = realpath($this->file);
    if (!file_exists($file)) {
      $response->setStatus(404);
      return false;
    }

    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mime = self::$types[$ext];

    $body = file_get_contents($file);

    $response->setStatus(200);
    $response->setHeader('Content-Type', $mime);
    $response->setBody($body);
    return true;
  }
}

?>
