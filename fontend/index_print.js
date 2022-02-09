var roles = localStorage.getItem('roles')
var username = localStorage.getItem('username')

$(document).ready(function() {
    $('.logout p').html(username)

    if (roles === 'A1' || roles === 'A2' || roles === 'A3') {
        $('.function_statistical_define_citizen').css('display', 'none')
    } else if (roles === 'B1') {
        $('.function_statistical_citizen').css('display', 'none')
    } else {
        $('.function_define_id_acc').css('display', 'none')
        $('.function_statistical_citizen').css('display', 'none')
        $('.statistical_location').css('display', 'none')

    }
    $('.function_table_statistical').click(function() {
        if ($('.sub_function').css('display') === 'none') {
            $('.sub_function').css('display', 'block')
        } else {
            $('.sub_function').css('display', 'none')
        }
    })
    
})

function logout() {
    ////////////////xóa
    window.localStorage.clear()
}

function change_password() {
    let pass = $('#model-fix-password .pass').val()
    let new_pass = $('#model-fix-password .new-pass').val()
    let new_pass_conf = $('#model-fix-password .new-pass-conf').val()
    $('#model-fix-password .pass').val('')
    $('#model-fix-password .new-pass').val('')
    $('#model-fix-password .new-pass-conf').val('')
    console.log(pass)
    console.log(new_pass)
    data = {
        password: new_pass,
        password_confirm: pass
    }
    result = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    regex = new RegExp(result)
                   
    if (new_pass !== new_pass_conf) {
        alert('Xác nhận mật khẩu chưa chính xác')
    } else if (!new_pass.match(regex)) {
        alert("Mật khẩu bắt buộc có: tối thiểu 8 ký tự, có ít nhất một chữ cái in hoa, một chữ cái in thường, một ký tự đặc biệt")                       
    }
    else {
        var render = new Promise((resolve, reject) => {
            let t = put_data('http://localhost:3000/account', data)
            resolve(t)
        })
        render
            .then(function (t) {
                if (t.message === 'Mật khẩu cũ chưa chính xác') {
                    alert("Mật khẩu cũ chưa chính xác")
                } else {
                    alert('Đã đổi mật khẩu thành công')
                }
            })
    }

    

}
