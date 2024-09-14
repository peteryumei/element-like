import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { LikeButtonComponent } from './like-button/like-button.component';
import 'zone.js';

createApplication()
    .then((app) => {
        const LikeButton = createCustomElement(LikeButtonComponent, { injector: app.injector });
        customElements.define('like-button', LikeButton);
    })
    .catch((err) => console.error(err));