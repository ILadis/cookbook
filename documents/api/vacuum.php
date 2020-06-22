<?php
namespace Devices;
use IO\Datagram, IO\Miio;

class Vacuum {
  private $host, $port, $token;

  public function __construct($host, $port, $token) {
    $this->host = $host;
    $this->port = $port;
    $this->token = $token;
  }

  public function clean($segments = false) {
    if (is_array($segments)) {
      $command = Miio\newCommand('app_segment_clean', $segments);
    } else {
      $command = Miio\newCommand('app_start');
    }
    $this->send($command);
  }

  public function pause() {
    $command = Miio\newCommand('app_pause');
    $this->send($command);
  }

  public function resume() {
    // TODO get_status.in_cleaning and do either resume_segment_clean or app_start
    $command = Miio\newCommand('resume_segment_clean');
    $this->send($command);
  }

  public function charge() {
    $command = Miio\newCommand('app_charge');
    $this->send($command);
  }

  private function send($command) {
    $socket = Datagram::open($this->host, $this->port, 3);
    $crypto = new Miio\Crypto($this->token);

    try {
      $packet = Miio\Packet::unpack(Miio\Packet::HELLO);
      $packet = $this->exchange($socket, $packet);

      $data = $crypto->encrypt($command);

      $packet = new Miio\Packet($packet);
      $packet->setPayload($data);
      $packet->setChecksum($this->token);

      $packet = $this->exchange($socket, $packet);

      $data = $packet->getPayload();
      $data = $crypto->decrypt($data);

      return $data;
    } finally {
      $socket->close();
    }
  }

  private function exchange($socket, $packet) {
    $data = Miio\Packet::pack($packet);
    $socket->write($data);

    $data = $socket->read(2048, false);
    $packet = Miio\Packet::unpack($data);

    return $packet;
  }
}

?>