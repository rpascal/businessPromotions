import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../validator';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private mode: string;
  private emailPasswordForm: FormGroup;
  private emailForm: FormGroup;

  constructor(public navCtrl: NavController, public loginProvider: LoginProvider, public formBuilder: FormBuilder) {
    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      radio : []
    });
    this.emailForm = formBuilder.group({
      email: Validator.emailValidator
    });
  }

  ionViewDidLoad() {
    this.mode = 'main';
  }

  login() {
     this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]).then(res => {
      this.navCtrl.setRoot("home");
    });
  }

  register() {
    console.log(this.emailPasswordForm.value["radio"]);
    this.loginProvider.register(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"],this.emailPasswordForm.value["radio"]).then(res => {
      this.navCtrl.setRoot("home");
    });
  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
  }

}
