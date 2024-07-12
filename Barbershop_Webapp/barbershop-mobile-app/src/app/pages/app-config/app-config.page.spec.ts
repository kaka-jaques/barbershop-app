import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigPage } from './app-config.page';

describe('AppConfigPage', () => {
  let component: AppConfigPage;
  let fixture: ComponentFixture<AppConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
