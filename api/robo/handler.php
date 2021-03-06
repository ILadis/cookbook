<?php
namespace Http\Handler;
use Http;

class VacuumSegmentClean implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $segments = (array) $request->getBodyAsJson();
    $segments = array_map('intval', $segments);
    $this->vacuum->segmentClean($segments);
    $response->setStatus(200);
    return true;
  }
}

class VacuumZoneClean implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $zones = (array) $request->getBodyAsJson();
    $this->vacuum->zoneClean($zones);
    $response->setStatus(200);
    return true;
  }
}

class VacuumPause implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $this->vacuum->pause();
    $response->setStatus(200);
    return true;
  }
}

class VacuumResume implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $this->vacuum->resume();
    $response->setStatus(200);
    return true;
  }
}

class VacuumCharge implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $this->vacuum->charge();
    $response->setStatus(200);
    return true;
  }
}

class VacuumStatus implements Http\Handler {
  private $vacuum;

  public function __construct($vacuum) {
    $this->vacuum = $vacuum;
  }

  public function handle($request, $response) {
    $status = $this->vacuum->status();
    $response->setStatus(200);
    $response->setBodyAsJson($status);
    return true;
  }
}

?>
