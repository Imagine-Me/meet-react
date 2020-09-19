import { atom } from 'recoil'


export const user = atom({
    key: "user",
    default: {
        name: "",
        id: "",
        db: null,
        stream: null,
        link: ""
    }
})