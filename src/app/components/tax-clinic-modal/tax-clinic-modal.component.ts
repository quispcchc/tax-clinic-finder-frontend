import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { Location } from '../../models/location.model';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-tax-clinic-modal',
  standalone: false,
  templateUrl: './tax-clinic-modal.component.html',
  styleUrls: ['./tax-clinic-modal.component.scss'],
})
export class TaxClinicModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() clinic: Clinic | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Clinic>();

  clinicForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clinicForm = this.fb.group({
      id: [null],
      organizationName: ['', Validators.required],
      organisationWebsite: [''],
      organisationalEmail: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPersonName: ['', Validators.required],
      contactPersonTitle: [''],
      listedOnCra: ['', Validators.required],
      visibleOnNceo: ['', Validators.required],
      alternateContactName: [''],
      alternateContactTitle: [''],
      alternateContactEmail: [''],
      alternateContactPhone: [''],
      catchmentArea: [''],
      locations: this.fb.array([], Validators.required),
      appointmentAvailability: ['', Validators.required],
      publicInfo: ['', Validators.required],
      wheelchairAccessible: [false],
      clinicTypes: this.fb.array([], Validators.required),
      monthsOffered: this.fb.array([], Validators.required),
      daysOfOperation: this.fb.array([], Validators.required),
      hoursAndDate: [''],
      hoursOfOperation: this.fb.array([], Validators.required),
      yearRoundService: ['', Validators.required],
      servePeopleFrom: ['', Validators.required],
      taxYearsPrepared: this.fb.array([], Validators.required),
      residencyTaxYear: this.fb.array([], Validators.required),
      servePeople: this.fb.array([], Validators.required),
      eligibilityCriteriaWebpage: [''],
      populationServed: this.fb.array([]),
      serviceLanguages: this.fb.array([], Validators.required),
      bookingProcess: this.fb.array([], Validators.required),
      bookingContactPhone: [''],
      bookingContactEmail: [''],
      onlineBookingLink: [''],
      usefulOnlineBooking: [''],
      bookingDaysHours: ['', Validators.required],
      onlineBookingUseful: [''],
      requiredDocuments: [''],
      helpWithMissingDocs: this.fb.array([], Validators.required),
      taxPreparers: this.fb.array([]),
      taxFilers: this.fb.array([]),
      volunteerRoles: this.fb.array([]),
      clinicCapacity: [''],
      additionalSupport: this.fb.array([]),
      comments: [''],
    },
    { validators: this.atLeastOneRequired }
  );
  }

  atLeastOneRequired(form: AbstractControl) {
    const website = form.get('organisationWebsite')?.value?.trim();
    const email = form.get('organisationalEmail')?.value?.trim();
  
    if (!website && !email) {
      return { atLeastOneRequired: true };
    }
  
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinic'] && this.clinic) {
      console.log("the clinic details from parent component is..", this.clinic);
      this.clinicForm.reset();
      this.clinicForm.patchValue({ ...this.clinic });
      console.log('Form Values:', this.clinicForm.value);

      this.populateFormArrays();
    }
  }

  private populateFormArrays() {
    const formArrays = [
      'clinicTypes',
      'monthsOffered',
      'daysOfOperation',
      'hoursOfOperation',
      'populationServed',
      'taxYearsPrepared',
      'residencyTaxYear',
      'servePeople',
      'serviceLanguages',
      'bookingProcess',
      'helpWithMissingDocs',
      'taxPreparers',
      'taxFilers',
      'volunteerRoles',
      'additionalSupport',
    ];
  
    formArrays.forEach((field) => {
      const formArray = this.clinicForm.get(field) as FormArray;
      formArray.clear();
      const values = this.convertToArray((this.clinic as any)?.[field]);
  
      values.forEach((value) => {
        formArray.push(new FormControl(value));
      });
    });
  
    const locationsArray = this.clinicForm.get('locations') as FormArray;
    locationsArray.clear();
    (this.clinic?.locations || []).forEach((loc) =>
      locationsArray.push(this.createLocationGroup(loc))
    );
  }

  private convertToArray(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return typeof value === 'string' ? value.split(', ').filter(Boolean) : [];
  }

  saveClinic() {
    if (this.clinicForm.valid) {
      const formValue = {
        ...this.clinicForm.value,
        locations: this.clinicForm.value.locations.map((loc: Location) => ({
          ...loc,
          taxClinicId: this.isEditMode ? this.clinic?.id : undefined,
        })),
      };
      this.save.emit(formValue);
    }
  }

  closeModal() {
    this.close.emit();
  }

  createLocationGroup(location?: Location): FormGroup {
    return this.fb.group({
      id: [location?.id || null],
      taxClinicId: [this.isEditMode && this.clinic ? this.clinic.id : null],
      street: [location?.street || '', Validators.required],
      city: [location?.city || '', Validators.required],
      state: [location?.state || '', Validators.required],
      postalCode: [location?.postalCode || '', Validators.required],
      createdDate: [location?.createdDate || new Date().toISOString()],
      updatedDate: [location?.updatedDate || new Date().toISOString()],
    });
  }

  addLocation(location?: Location): void {
    (this.clinicForm.get('locations') as FormArray).push(
      this.createLocationGroup(location)
    );
  }

  removeLocation(index: number): void {
    (this.clinicForm.get('locations') as FormArray).removeAt(index);
  }

  get locationsFormArray(): FormArray {
    return this.clinicForm.get('locations') as FormArray;
  }

  onCheckboxChange(controlName: string, event: any) {
    const formArray = this.clinicForm.get(controlName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      const index = formArray.controls.findIndex(
        (ctrl) => ctrl.value === event.target.value
      );
      if (index !== -1) formArray.removeAt(index);
    }
    formArray.markAsTouched();
  }

  onServePeopleChange(event: any) {
    if (event.target.value === 'other') {
      this.clinicForm.addControl(
        'servePeopleFromOther',
        new FormControl('', Validators.required)
      );
    } else {
      this.clinicForm.removeControl('servePeopleFromOther');
    }
  }
}
