//프론트엔드(Front-end)
const socket = io(); //백엔드 소켓io와 연결

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute"); //음소거 버튼
const cameraBtn = document.getElementById("camera"); //카메라 버튼
const camerasSelect = document.getElementById("cameras"); //카메라 버튼
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false; //초기상태
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
  //카메라 리스트로 보여줌
  try {
    const devices = await navigator.mediaDevices.enumerateDevices(); //연결 장치 가져오기
    const cameras = devices.filter((device) => device.kind === "videoinput"); //videoinput만
    const currentCamera = myStream.getVideoTracks()[0]; //현재 카메라 알 수 있음
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label; //이름
      if (currentCamera.label === camera.label) {
        //현재 카메라로 보여줌
        option.selected = true;
      }
      camerasSelect.appendChild(option); //카메라를 리스트에 추가
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const initialConstrains = {
    //초기 설정, 셀카 모드
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    //카메라 선택 설정
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    //스트림 가져오기(권한 허용)
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains //deviceId있으면 카메라선택한거 아니면 초기
    );
    myFace.srcObject = myStream; //비디오 홈페이지에 표시하기
    if (!deviceId) {
      await getCameras(); //모든 장치 가져오기
    }
  } catch (e) {
    //에러발생시
    console.log(e);
  }
}

// getMedia();

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled)); //값 반전시키기
  if (!muted) {
    //음소거 아니면
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled)); //값 반전시키기
  if (cameraOff) {
    //카메라 켜져있으면
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}
async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// const welcome = document.getElementById("welcome");
// const form = welcome.querySelector("form");
// const room = document.getElementById("room");

// room.hidden = true; //처음에는 방 숨겨주기
// let roomName;

// function addMessage(message) {
//   const ul = room.querySelector("ul");
//   const li = document.createElement("li");
//   li.innerText = message;
//   ul.appendChild(li);
// }
// function handleMessageSubmit(event) {
//   event.preventDefault();
//   const input = room.querySelector("#msg input");
//   const value = input.value;
//   socket.emit("new_message", input.value, roomName, () => {
//     addMessage(`You: ${value}`);
//   });
//   input.value = "";
// }

// function showRoom() {
//   welcome.hidden = true;
//   room.hidden = false;
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room ${roomName}`; //방 이름 바뀔수도있으므로
//   const msgForm = room.querySelector("#msg");
//   msgForm.addEventListener("submit", handleMessageSubmit);
// }

// function handleRoomSubmit(event) {
//   event.preventDefault();
//   const roomInput = form.querySelector("input");
//   const nameInput = form.querySelector("#name"); //닉네임
//   socket.emit("enter_room", roomInput.value, nameInput.value, showRoom); //이벤트와 인자(객체도 가능), 콜백함수
//   roomName = roomInput.value;
//   input.value = "";
// }

// form.addEventListener("submit", handleRoomSubmit);

// // function handleNicknameSubmit(event) {
// //   event.preventDefault();
// //   const input = welcome.querySelector("#name input");
// //   socket.emit("nickname", input.value);
// // }
// // const nameForm = welcome.querySelector("#name");
// // nameForm.addEventListener("submit", handleNicknameSubmit);

// socket.on("welcome", (user) => {
//   addMessage(`${user} arrived!`);
// });
// socket.on("bye", (left) => {
//   addMessage(`${left} left ㅠㅠ`);
// });
// socket.on("new_message", (msg) => addMessage(msg));

///Welcome Form (join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function startMedia() {
  welcome.hidden = true; //방 입력 창 숨김
  call.hidden = false; //call 보여줌
  await getMedia();
  makeConnection();
}

function handleWelcomeSubmit(event) {
  //제출 버튼 누를때
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startMedia); //소켓 보내기
  roomName = input.value; //방 이름
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//Socket Code
socket.on("welcome", async () => {
  //방 들어왔을때
  const offer = await myPeerConnection.createOffer(); //offer만들기
  myPeerConnection.setLocalDescrpition(offer); //offer로 연결만들기
  console.log("send the offer");
  socket.emit("offer", offer, roomName); //offer를 서버로 보내기
});
socket.on("offer", (offer) => {
  console.log(offer);
});

//RTC Code
function makeConnection() {
  const myPeerConnection = new RTCPeerConnection(); //연결 만들기
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream)); //video, audio stream 추가
}
