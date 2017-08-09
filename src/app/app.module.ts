import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Routing } from "./app.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/root-component/app.component';
import { HomeComponent } from './components/home/home.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { CreateGroupChatComponent } from './components/create-group-chat/create-group-chat.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LatestUpdatesComponent } from './components/latest-updates/latest-updates.component';
import { ListContactsComponent } from './components/list-contacts/list-contacts.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MainComponent } from './components/main/main.component';
import { MainButtonsComponent } from './components/main-buttons/main-buttons.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ManageContactsComponent } from './components/manage-contacts/manage-contacts.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';

import { ForbiddenNameDirective } from './directives/forbidden-name.directive';

import { LoginService } from './services/login/login.service';
import { RegisterService } from './services/register/register.service';
import { DataService } from './services/data/data.service';
import { ChatService } from './services/chat/chat.service';
import { BroadcastService } from './services/broadcast/broadcast.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatViewComponent,
    CreateGroupChatComponent,
    DashboardComponent,
    LatestUpdatesComponent,
    ListContactsComponent,
    LoginComponent,
    LogoutComponent,
    MainComponent,
    MainButtonsComponent,
    MainNavComponent,
    ManageContactsComponent,
    NotificationCardComponent,
    RegisterComponent,
    SettingsComponent,
    ForbiddenNameDirective
  ],
  imports: [
    BrowserModule,
    Routing,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    LoginService,
    DataService,
    RegisterService,
    ChatService,
    BroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
