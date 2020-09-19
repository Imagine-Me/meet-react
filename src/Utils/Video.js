export const getUserStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        return stream
    }catch(e){
        console.log(e)
    }
} 