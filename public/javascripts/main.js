$(document).ready(function () {
  $(".login-symbol").click(() => {
    $(".form-page").css("background-color", "#ffff");
    $(".login-symbol").css("display", "none");
    $(".admin-form").slideDown().css("display", "flex");
  });
  $("#admin-user").focus(() => {
    $("#admin-userLabel").html("Enter admin username");
    $("#admin-userLabel").css("margin-bottom", " 10px");
  });
  $("#admin-user").focusout(() => {
    $("#admin-userLabel").html("admin Username");
    let username = $("#admin-user").val();
    if (username.length == 0) {
      $("#admin-userLabel").css("margin-bottom", " -30px");
    } else {
      $("#admin-userLabel").css("margin-bottom", " 5px");
    }
  });
  $("#admin-pass").focus(() => {
    $("#admin-passLabel").html("Enter Your Password");
    $("#admin-passLabel").css("margin-bottom", "10px");
  });
  $("#admin-pass").focusout(() => {
    $("#admin-passLabel").html("Admin Password");
    let adminpass = $("#admin-pass").val();
    if (adminpass.length == 0) {
      $("#admin-passLabel").css("margin-bottom", " -30px");
    } else {
      $("#admin-passLabel").css("margin-bottom", " 5px");
    }
  });
});

$("#admin-login").submit((e) => {
  e.preventDefault();
  var form = $("#admin-login");

  let user = $("#admin-user").val();
  let pass = $("#admin-pass").val();
  if (!user.trim().length) {
    $("#admin-alert").html("please enter username");
  } else if (!pass.trim().length) {
    $("#admin-alert").html("please enter Password");
  } else {
    $("#admin-alert").html("");
    $.ajax({
      type: "POST",
      url: "/admin",
      data: form.serialize(),
      // serializes the form's elements.
      success: function (data) {
        if (data.status == true) {
          window.location.href = "/admin/dashboard";
        } else {
          console.log(data.errmsg);
          $("#admin-alert").html(data.errmsg);
        }
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  }
});
// form validation

const signUp = {
  username: false,
  email: false,
  phone: false,
  image: false,
  password: false,
};
const updating = {
  username: true,
  phone: true,
  image: true,
};
// sign up form username
$("#sign-up-username").keyup(() => {
  let signUpusername = $("#sign-up-username").val();
  let expression = /^[a-zA-Z\s]*$/;
  if (!signUpusername || /^\s*$/.test(signUpusername)) {
    signUp.username = false;
    updating.username = false;
    $("#user-username-alert").html("Enter Username");
  } else if (signUpusername.match(expression)) {
    signUp.username = true;
    updating.username = true;
    $("#user-username-alert").html("");
  } else {
    signUp.username = false;
    updating.username = false;
    $("#user-username-alert").html("Enter Character Only");
  }
});

// sign up form email

$("#sign-up-email").keyup(() => {
  let signUpuemail = $("#sign-up-email").val();
  let expression = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!signUpuemail || /^\s*$/.test(signUpuemail)) {
    signUp.email = false;

    $("#user-email-alert").html("Enter Your Email");
  } else if (signUpuemail.match(expression)) {
    signUp.email = true;

    $("#user-email-alert").html("");
  } else {
    signUp.email = false;

    $("#user-email-alert").html("Enter Correct Email");
  }
});

// form validation  phone

$("#sign-up-phone").keyup(() => {
  let signUpphone = $("#sign-up-phone").val();
  let expression = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!signUpphone || /^\s*$/.test(signUpphone)) {
    signUp.phone = false;
    updating.phone = false;
    $("#user-phone-alert").html("Enter Your Phone Number");
  } else if (signUpphone.match(expression)) {
    signUp.phone = true;
    updating.phone = true;
    $("#user-phone-alert").html("");
  } else {
    signUp.phone = false;
    updating.phone = true;
    $("#user-phone-alert").html("Enter Correct phone Number");
  }
});

// form validation image
$("#sign-up-image").keyup(() => {
  let signUpimage = $("#sign-up-image").val();
  if (!signUpimage || /^\s*$/.test(signUpimage)) {
    signUp.image = false;
    updating.image = false;
    $("#user-image-alert").html("Enter Link of Your Image");
  } else {
    signUp.image = true;
    updating.image = true;
    $("#user-image-alert").html("");
  }
});

// form pass word
$("#sign-up-pass1").keyup(() => {
  let signUpimage = $("#sign-up-pass1").val();
  if (!signUpimage || /^\s*$/.test(signUpimage)) {
    signUp.password = false;
    $("#user-password-alert").html("Enter Your Password");
  } else {
    signUp.password = true;
    $("#user-password-alert").html("");
  }
});

// null validation

function nullValueCheck() {
  let signUpusername = $("#sign-up-username").val();
  let signUpuemail = $("#sign-up-email").val();
  let signUpphone = $("#sign-up-phone").val();
  let signUpimage = $("#sign-up-image").val();
  let pas1 = $("#sign-up-pass1").val();
  let pas2 = $("#sign-up-pass2").val();
  let exp = /^\s*$/;
  let alertsignUp = $("#user-signup-alert");
  if (!signUpusername || exp.test(signUpusername)) {
    $("#sign-up-username").focus();
    alert("Enter Your username");
  } else if (!signUpuemail || exp.test(signUpuemail)) {
    $("#sign-up-email").focus();
    alert("Enter Your email");
  } else if (!signUpphone || exp.test(signUpphone)) {
    $("#sign-up-phone").focus();
    alert("Enter Your phone number");
  } else if (!signUpimage || exp.test(signUpimage)) {
    $("#sign-up-image").focus();
    alert("Enter Your Image Link");
  } else if (!pas1 || exp.test(pas1)) {
    $("#sign-up-pass1").focus();
    alert("Enter Your Password");
  } else if (!pas2 || exp.test(pas2)) {
    $("#sign-up-pass2").focus();
    alert("Confirm Your Password");
  } else {
    return true;
  }
}

// all validation
function signupValidation() {
  if (
    signUp.username &&
    signUp.email &&
    signUp.phone &&
    signUp.image &&
    signUp.password
  ) {
    return true;
  } else {
    return false;
  }
}

// ajax submition
$("#user-register").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  let nullchek = nullValueCheck();
  if (nullchek) {
    let chekedValue = signupValidation();
    if (chekedValue) {
      let pas1 = $("#sign-up-pass1").val();
      let pas2 = $("#sign-up-pass2").val();
      if (pas1 == pas2) {
        $.ajax({
          type: "POST",
          url: "/sign-up",
          data: form.serialize(), // serializes the form's elements.
          success: function (data) {
            if (data.status == true) {
              window.location.href = "/get-in";
            } else {
              $("#user-signup-alert").html("User already exist");
            }
          },
          error: function (data) {
            console.log("An error occurred.");
            console.log(data);
          },
        });
      } else {
        $("#user-signup-alert").html("Password not match");
      }
    } else {
      console.log(signUp);
      alert("Invalid form data");
    }
  }
});

// sign in
$("#signin-form").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  $.ajax({
    type: "POST",
    url: "/sign-in",
    data: form.serialize(),
    // serializes the form's elements.
    success: function (data) {
      if (data.status == true) {
        window.location.href = "/get-in";
      } else {
        $("#user-signin-alert").html(data.msg);
      }
    },
    error: function (data) {
      console.log("An error occurred.");
      console.log(data);
    },
  });
});

// admin register
function adminValidation() {
  if (signUp.username && signUp.email && signUp.image && signUp.password) {
    return true;
  } else {
    return false;
  }
}

$("#adminRegister").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  nullValueCheck();
  let chekedValue = adminValidation();
  if (chekedValue) {
    let pas1 = $("#sign-up-pass1").val();
    let pas2 = $("#sign-up-pass2").val();
    if (pas1 == pas2) {
      $.ajax({
        type: "POST",
        url: "/admin/add-admin",
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
          if (data.status == true) {
            window.location.href = "/admin/dashboard";
          } else {
            $("#user-signup-alert").html("Username already exist");
          }
        },
        error: function (err) {
          console.log("An error occurred.");
          console.log(data);
        },
      });
    } else {
      $("#user-signup-alert").html("Password not match");
    }
  } else {
    console.log(signUp);
    alert("Invalid form data");
  }
});

//  admin change password admin

$("#admin-changePass").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  let pass = $(".admin-old-pass").val();
  let new1 = $(".admin-new-pass").val();
  let new2 = $(".admin-c-pass").val();
  if (!pass.trim().length) {
    $(".admin-old-pass").focus();
    $("#admin-alert").html("Enter Your Old Password");
  } else if (!new1.trim().length) {
    $(".admin-new-pass").focus();
    $("#admin-alert").html("Enter Your Password");
  } else if (!new2.trim().length) {
    $(".admin-c-pass").focus();
    $("#admin-alert").html("Confirm Your Password");
  } else {
    if (new1 == new2) {
      $("#admin-alert").html("");
      $.ajax({
        type: "POST",
        url: "/admin/change-pass",
        data: form.serialize(),
        success: function (user) {
          if (user.status == true) {
            $("#admin-alert").css("color", "green").html(user.msg);
            setTimeout(() => {
              window.location.href = "/admin/dashboard";
            }, 3000);
          } else {
            $("#admin-alert").html(user.msg);
          }
        },
        error: function (err) {
          console.log("An error occurred.");
          console.log(data);
        },
      });
    } else {
      $("#admin-alert").html("Password not match!");
    }
  }
});

// admin add user
$("#admin-add-user").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  let nucllchek = nullValueCheck();
  let chekedValue = signupValidation();
  if (nucllchek) {
    if (chekedValue) {
      let pas1 = $("#sign-up-pass1").val();
      let pas2 = $("#sign-up-pass2").val();
      if (pas1 == pas2) {
        $.ajax({
          type: "POST",
          url: "/admin/add-user",
          data: form.serialize(), // serializes the form's elements.
          success: function (data) {
            if (data.status == true) {
              window.location.href = "/admin/dashboard";
            } else {
              $("#user-signup-alert").html(data.msg);
            }
          },
          error: function (data) {
            console.log("An error occurred.");
            console.log(data);
          },
        });
      } else {
        $("#user-signup-alert").html("Password not match");
      }
    } else {
      alert("Invalid form data");
    }
  }
});

// admin changing user status

function changeStatus(e, id) {
  e.preventDefault();
  let button = $("." + id);
  $.ajax({
    url: "/admin/userstatus/" + id,
    type: "GET",
    success: function (data) {
      if (data.status == true) {
        button.removeClass("btn-danger");
        button.html("Active");
        button.addClass("btn-success");
      } else {
        button.removeClass("btn-success");
        button.html("Deactive");
        button.addClass("btn-danger");
      }
    },
    error: function (data) {
      console.log("An error occurred.");
      console.log(data);
    },
  });
}

// showing user photo in edit page
function changingPhoto() {
  let imagURL = $("#sign-up-image").val();
  $("#userPhoto").attr("src", imagURL);
}

// function updtateUser() {
//   if (signUp.username && signUp.phone && signUp.image) {
//     return true;
//   } else {
//     return false;
//   }
// }

function updatingUser() {
  if (updating.username && updating.phone && updating.image) {
    return true;
  } else {
    return false;
  }
}
// ajx for updating user
$("#user-updating-data").submit(function (e) {
  e.preventDefault();
  var form = $(this);
  var id = $("#ckeck-User-Id").val();
  let checkStatus = updatingUser();
  if (checkStatus) {
    $.ajax({
      type: "POST",
      url: "/admin/user-edit/" + id,
      data: form.serialize(), // serializes the form's elements.
      success: function (data) {
        if (data.status == true) {
          $("#user-signup-alert").css("color", "green").html(data.msg);
          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 2000);
        } else {
          $("#user-signup-alert").html(data.msg);
        }
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  } else {
    alert("invalid form data");
  }
});

// ajx for delete

function deleteUser(e, id) {
  e.preventDefault();
  let conf = confirm("are you sure?");
  if (conf) {
    $.ajax({
      type: "GET",
      url: "/admin/delete-user/" + id,
      success: function (data) {
        if (data.status == true) {
          $("#" + id).css("display", "none");
        } else {
          alert(data.msg);
        }
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  }
}
