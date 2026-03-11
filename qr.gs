<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin - Dynamic QR Presensi</title>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>

<style>

:root{
--primary:#6366f1;
--text:#1e293b;
}

*{
box-sizing:border-box;
}

body{
font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
background:linear-gradient(135deg,#eef2ff,#f8fafc);
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
margin:0;
padding:16px;
}

.container{
background:#fff;
padding:28px;
border-radius:18px;
box-shadow:0 15px 30px rgba(0,0,0,.12);
width:100%;
max-width:380px;
}

h2{
margin:0 0 18px 0;
text-align:center;
color:var(--text);
}

label{
display:block;
font-size:13px;
font-weight:600;
margin-bottom:6px;
color:#475569;
text-align:left;
}

input{
width:100%;
padding:12px 14px;
border-radius:10px;
border:1.5px solid #e2e8f0;
font-size:14px;
margin-bottom:14px;
outline:none;
transition:.2s;
}

input:focus{
border-color:var(--primary);
box-shadow:0 0 0 2px rgba(99,102,241,.15);
}

button{
width:100%;
padding:13px;
border:none;
border-radius:10px;
background:var(--primary);
color:#fff;
font-weight:600;
font-size:14px;
cursor:pointer;
transition:.2s;
}

button:hover{
background:#4f46e5;
}

#btnStop{
background:#94a3b8;
margin-top:10px;
display:none;
}

#qrcode-wrapper{
margin-top:20px;
padding:18px;
background:#f8fafc;
border-radius:14px;
display:none;
border:1px dashed #cbd5f5;
text-align:center;
}

#qrcode{
display:flex;
justify-content:center;
}

.timer-container{
margin-top:12px;
font-weight:600;
font-size:14px;
color:#475569;
}

#timer{
color:#ef4444;
font-family:monospace;
font-size:18px;
margin-left:4px;
}

.badge-success{
background:#dcfce7;
color:#166534;
padding:8px 12px;
border-radius:20px;
font-size:14px;
font-weight:600;
display:none;
margin-bottom:10px;
}

</style>
</head>

<body>
<div class="container">
  <h2>QR Presensi Dinamis</h2>

  <div class="form-group">
  <label>Course ID</label>
  <input id="course" value="cloud-101">
  </div>

  <div class="form-group">
  <label>Session ID</label>
  <input id="session" value="sesi-01">
  </div>

  <button id="btnAction" onclick="startDynamicQR()">Mulai Presensi</button>
  <button id="btnStop" onclick="stopDynamicQR()">Berhenti</button>

  <div id="qrcode-wrapper">
    <div id="qrcode"></div>
    <div class="timer-container">
      QR expired dalam: <span id="timer">120</span> detik
    </div>
  </div>
</div>

<script>
const BASE="https://script.google.com/macros/s/AKfycby5be8mymZEOu4LsmL0tqQt0DiERwV4N_tH-lHkm9BmhUcMUvlyiGnoXNKTFzC2hnXM/exec";
const CLIENT_SCAN="https://cindyprtslbs.github.io/DynamicQR_Project/scan.html";

let tokenInterval;
let countdownInterval;
let pollInterval;
let timeLeft=120;

async function generateQR(){
  const course=document.getElementById("course").value;
  const session=document.getElementById("session").value;

  try{
    const res=await fetch(`${BASE}?path=/presence/qr/generate`,{
      method:"POST",
      body:JSON.stringify({
        course_id:course,
        session_id:session,
        ts:new Date().toISOString()
      })
    });

    const json=await res.json();

    if(json.ok){
      const token=json.data.qr_token;
      const scanUrl=`${CLIENT_SCAN}?token=${token}&course=${course}&session=${session}`;

      const qr=document.getElementById("qrcode");
      qr.innerHTML="";

      QRCode.toCanvas(scanUrl,{width:200,margin:2},(err,canvas)=>{
        qr.appendChild(canvas);
      });

      startPolling(token);
    }
  }catch(e){
    console.log("QR error",e);
  }
}

function startDynamicQR(){
  document.getElementById("btnAction").style.display="none";
  document.getElementById("btnStop").style.display="block";
  document.getElementById("qrcode-wrapper").style.display="block";

  timeLeft=120;
  updateTimerDisplay();

  generateQR();

  // token ganti tiap 10 detik
  tokenInterval=setInterval(generateQR,10000);

  // countdown expired auto-loop
  countdownInterval=setInterval(()=>{
    timeLeft--;
    updateTimerDisplay();

    if(timeLeft<=0){
      timeLeft=120;
      updateTimerDisplay();
      generateQR();
    }
  },1000);
}

function stopDynamicQR(){
  clearInterval(tokenInterval);
  clearInterval(countdownInterval);
  clearInterval(pollInterval);

  document.getElementById("btnAction").style.display="block";
  document.getElementById("btnStop").style.display="none";
  document.getElementById("qrcode-wrapper").style.display="none";
}

function updateTimerDisplay(){
  document.getElementById("timer").innerText=timeLeft;
}

function startPolling(token){
  if(pollInterval) clearInterval(pollInterval);

  pollInterval = setInterval(async()=>{
    try{
      const res = await fetch(`${BASE}?path=/presence/token&qr_token=${token}`);
      const json = await res.json();

    }catch(e){}
  },3000);
}
</script>
</body>
</html>