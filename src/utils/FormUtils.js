const FormUtils = {

    /**
     * 使用POST带表单数据的方式打开新窗口
     * @param {Stirng} url 目标地址
     * @param {Boolean} newWindow 是否在新窗口打开
     * @param {Object} filed 附加的表单字段
     */
    jumpWithPost(url, newWindow, filed) {
        const form = document.createElement('form')
        form.action = url
        form.method = 'post'
        if (newWindow) {
            form.target = '_blank'
        }
        for (const key in filed) {
            if (Object.hasOwnProperty.call(filed, key)) {
                const value = filed[key]
                const input = document.createElement('input')
                input.name = key
                input.value = value
                form.appendChild(input)
            }
        }
        form.style.display = 'none'
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
    }
}
module.exports = FormUtils
