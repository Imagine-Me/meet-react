export const getUserStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        return stream
    } catch (e) {
        console.log("[getUserStream (Video.js)]", e)
    }
}

export const initiatePeerConnection = () => {
    try {
        const configuration = {
            iceServers: [{ urls: 'stun:stun2.1.google.com:19302' }]
        }
        const connection = new RTCPeerConnection(configuration)
        return connection
    } catch (e) {
        console.log("[initiatePeerConnection (Video.js)", e)
    }
}

export const createOffer = (pc, db, link) => {
    pc.createOffer({ offerToReceiveVideo: 1 })
        .then(sdp => {
            return pc.setLocalDescription(sdp)
        })
        .then(() => {
            const database = db.database()
            database.ref().child('room').child(link).update({
                offer: pc.localDescription
            })
        })
}


export const answerOffer = () => {

}
