import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BuscadorComponent } from './buscador.component';
import { ExperienciaService } from '../services/experiencia.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Experiencia } from '../models/experiencia.model';

describe('BuscadorComponent', () => {
  let component: BuscadorComponent;
  let fixture: ComponentFixture<BuscadorComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockExperienciaService: jasmine.SpyObj<ExperienciaService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    mockExperienciaService = jasmine.createSpyObj('ExperienciaService', ['getExperiencias']);

    await TestBed.configureTestingModule({
      declarations: [BuscadorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ExperienciaService, useValue: mockExperienciaService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search and find user experiences', () => {
    const mockUsers: User[] = [{ _id: '1', name: 'John Doe', mail: 'john@example.com', password: '', comment: '' }];
    const mockExperiences: Experiencia[] = [{ _id: '1', owner: '1', participants: [], description: 'Test Experience' }];
    
    mockUserService.getUsers.and.returnValue(of(mockUsers));
    mockExperienciaService.getExperiencias.and.returnValue(of(mockExperiences));
    
    component.ngOnInit();
    component.searchForm.controls['username'].setValue('John Doe');
    component.searchUser();
    
    expect(component.userExperiences.length).toBe(1);
    expect(component.userFound).toBe(true);
  });
});
