import { atom } from 'recoil'


export const user = atom({
    key: "user",
    default: {
        name: "",
        id: "",
        stream: null
    }
})