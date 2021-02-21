const socket = io('/')
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port : '3030'
}); 


const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video')
myVideo.muted = true


let myVideoSteam

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream =>{
    myVideoSteam = stream
    addVideoStream(myVideo, myVideoSteam)

    peer.on('call', call => {
        call.answer(myVideoSteam)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, myVideoSteam)
    })
    
})


peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}