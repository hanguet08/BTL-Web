$(document).ready(function() {
    start()
})

function start() {
    

    validation()
    $('.btn-login').click(function() {
        var username = $('.login-form .username input').val()
        var pass = $('.login-form .password input').val()

        var data = {
            'username': username,
            'password': pass
        }
        var url = 'http://localhost:3000/signin'
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                // viết logic đăng nhập
                if (data.message === 'User Not found.') {
                    alert('Tên đăng nhập không tồn tại.')
                } else if (data.message === 'Invalid Password!') {
                    alert('Mật khẩu không chính xác')
                } else {
                    localStorage.setItem('username', data.username)
                    localStorage.setItem('roles', data.roles)
                    localStorage.setItem('province', data.city)
                    localStorage.setItem('district', data.district)
                    localStorage.setItem('ward', data.ward)
                    localStorage.setItem('hamlet', data.village)
                    localStorage.setItem('accToken', data.accessToken)
                    localStorage.setItem('active', String(data.isActive))
                    localStorage.setItem('complete', data.isComplete)
                    console.log(data)

                    if (data.roles[0] === 'A1' || data.roles[0] === 'A2' || data.roles[0] === 'A3' || data.roles[0] === 'B1') {
                        location.assign("index_define.html");
                    } else {
                        location.assign("index_citizen_B.html");
                    }


                }
            })
    })

}

// các hàm cho index

function validation() {
    $('.login-form .username').children('input').keyup(function() {
        if ($(this).val().length === 0) {
            $(this).addClass('is-invalid')
            $(this).removeClass('is-valid')
        } else {
            $(this).addClass('is-valid')
            $(this).removeClass('is-invalid')

        }
    })

    $('.login-form .password').children('input').keyup(function() {
        if ($(this).val().length < 8) {
            $(this).addClass('is-invalid')
            $(this).removeClass('is-valid')
        } else {
            $(this).addClass('is-valid')
            $(this).removeClass('is-invalid')

        }
    })

    $("#show_hide_password a").on('click', function(event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("fa-eye-slash");
            $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("fa-eye-slash");
            $('#show_hide_password i').addClass("fa-eye");
        }
    });

}


