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
    return pc.createOffer({ offerToReceiveVideo: 1 })
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

export const addRemoteDescription = (pc, db, sdp, link = null, host = false) => {
    console.log("ADDING REMOTE DESCRIPTION.....")
    pc.setRemoteDescription(new RTCSessionDescription(sdp))
    if (host) {
        const database = db.database()
        database.ref().child('room').child(link).update({
            candidateState: true
        })
    }
}


export const answerOffer = (pc, db, link) => {
    console.log("CREATING ANSWER......")
    pc.createAnswer({ offerToReceiveVideo: 1 })
        .then(sdp => {
            pc.setLocalDescription(sdp)
        })
        .then(() => {
            const database = db.database()
            database.ref().child('room').child(link).update({
                answer: pc.localDescription
            })
        })
}


export const addICECandidate = (pc, candidate) => {
    console.log("ADDING ICE CANDIDATE..")
    for (const key in candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate[key]))
    }
}