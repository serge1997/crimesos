import { ElNotification } from "element-plus";

export class Notify{

    success(message, title = null){
        return ElNotification({
            type: 'success',
            message: message,
            title: title
        })
    }

    error(message, title = null){
        return ElNotification({
            type: 'error',
            message: message,
            title: title
        })
    }
}