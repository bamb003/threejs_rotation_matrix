// ページの読み込みを待つ
window.addEventListener("load", init);

function deg2rad(d) {
  return (d * Math.PI) / 180;
}

function rad2deg(r) {
  return (r * 180) / Math.PI;
}

function init() {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラ
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight
  );
  camera.position.set(50, 100, 200);
  // 原点方向を見つめる
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // cameraのいろいろを表示するhelper
  var cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);

  // grid平面表示
  var size = 100;
  var step = 10; //平面を何個に分けるか
  var gridHelper = new THREE.GridHelper(size, step);
  gridHelper.position.y = 0;
  gridHelper.position.x = 0;
  scene.add(gridHelper);

  // XYZ軸表示
  var axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // 矢印
  var dir = new THREE.Vector3(1, 1, 1); // Must be a unit vector.
  dir.normalize();
  var origin = new THREE.Vector3(0, 0, 0);
  var length = 60;
  var hex = 0xffff00;
  var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
  scene.add(arrowHelper);

  // ここからgeometry

  // 箱を作成
  const box_width = 10;
  const box_height = 20;
  const box_depth = 40;
  var geometry = new THREE.BoxGeometry(box_width, box_height, box_depth);
  var material = new THREE.MeshNormalMaterial();
  var box = new THREE.Mesh(geometry, material);
  scene.add(box);
  // 角が原点に合うように調整
  box.position.x = box_width / 2;
  box.position.y = box_height / 2;
  box.position.z = box_depth / 2;

  // planeを作成
  geometry = new THREE.PlaneGeometry(500, 50, 10);
  material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  //scene.add(plane);

  /*
   *  tweakpane
   * 入出力UI
   */
  const pane = new Tweakpane({ title: "Parameters" });
  // Parameter object
  const PARAMS = {
    speed: 0.5
  };
  pane.addInput(PARAMS, "speed", {
    min: 90,
    max: 360
  });

  /*
   * BOX用folder
   */
  const fbox = pane.addFolder({
    title: "Box"
  });
  /*
  fbox.addMonitor(box.rotation, "x", {
    label: "box.rotation.x"
  }); */
  fbox.addMonitor(box.rotation, "y", {
    label: "rotation.y"
  });
  /*
  fbox.addMonitor(box.rotation, "z", {
    label: "box.rotation.z"
  }); */
  const BOX_PARAMS = {
    offset: { x: 50, y: 25 }
  };

  fbox.addInput(BOX_PARAMS, "offset");

  /*
   * Camera
   */

  const f1 = pane.addFolder({
    title: "Camera"
  });
  f1.addInput(PARAMS, "speed");
  f1.addMonitor(camera.rotation, "x", { label: "rotation.x" });
  f1.addMonitor(camera.rotation, "y", { label: "rotation.y" });
  f1.addMonitor(camera.rotation, "z", { label: "rotation.z" });
  f1.addMonitor(camera.position, "x", { label: "position.x" });
  f1.addMonitor(camera.position, "y", { label: "position.y" });
  f1.addMonitor(camera.position, "z", { label: "position.z" });

  // UI入力

  // カメラをマウスで扱えるコントローラーを作成
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  let rot = 0; // 角度
  let mouseX = 0; // マウス座標

  // マウス座標はマウスが動いた時のみ取得できる
  document.addEventListener("mousemove", event => {
    mouseX = event.pageX;
  });

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRot = (mouseX / window.innerWidth) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rot += (targetRot - rot) * 0.02;

    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    //camera.position.x = 1000 * Math.sin(radian);
    //    camera.position.z = 1000 * Math.cos(radian);

    //box.rotation.y += 0.01;
    //box.rotation.y += 0.01;
    //box.rotation.z += 0.01;
    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(tick);
  }
}
