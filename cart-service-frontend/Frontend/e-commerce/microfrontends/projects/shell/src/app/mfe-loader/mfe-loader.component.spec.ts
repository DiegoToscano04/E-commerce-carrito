import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfeLoaderComponent } from './mfe-loader.component';

describe('MfeLoaderComponent', () => {
  let component: MfeLoaderComponent;
  let fixture: ComponentFixture<MfeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfeLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MfeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
