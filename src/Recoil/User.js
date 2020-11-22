import { atom } from 'recoil'


export const user = atom({
    key: "user",
    default: {
        email: "",
        password: "",
        id: "",
        firebase: null,
        stream: null,
        link: "",
        offer: null,
        host: false,
        pc: null,
        answer: null,
        candidate: null,
        client: "",
        constraints: {
            audio: true,
            video: true
        }
    }
})