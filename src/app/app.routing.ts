import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from './components/root-component/app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LatestUpdatesComponent } from './components/latest-updates/latest-updates.component';
import { ListContactsComponent } from './components/list-contacts/list-contacts.component';
import { MainComponent } from './components/main/main.component';
import { MainButtonsComponent } from './components/main-buttons/main-buttons.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ManageContactsComponent } from './components/manage-contacts/manage-contacts.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LogoutComponent } from './components/logout/logout.component';
import { CreateGroupChatComponent } from './components/create-group-chat/create-group-chat.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';

import { DataService } from './services/data/data.service';
import { ChatService } from './services/chat/chat.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent, resolve: { loadedProfile: DataService }, children: [
      { path: '', component: MainComponent },
      { path: 'main', component: MainComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'manageContacts', component: ManageContactsComponent },
      { path: 'listContacts', component: ListContactsComponent },
      { path: 'createGroupChat', component: CreateGroupChatComponent },
      { path: 'chat/:conversationId', component: ChatViewComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'logout', component: LogoutComponent }
    ]
  },
];

export const Routing = RouterModule.forRoot(routes);
