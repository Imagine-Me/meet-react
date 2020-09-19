export const getUserStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        return stream
    }catch(e){
        console.log("[getUserStream (Video.js)]",e)
    }
} 

export const initiatePeerConnection = async () => {
    try{
        const configuration = {
            iceServers: [{ urls: 'stun:stun2.1.google.com:19302' }]
        }
        const connection = new RTCPeerConnection(configuration)
        return connection
    }catch(e){
        console.log("[initiatePeerConnection (Video.js)",e)
    }
}