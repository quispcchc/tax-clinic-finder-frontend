import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tax-clinic-modal',
  standalone: false,
  templateUrl: './tax-clinic-modal.component.html',
  styleUrls: ['./tax-clinic-modal.component.scss'],
})
export class TaxClinicModalComponent implements OnChanges, OnInit {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() clinic: Clinic | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Clinic>();

  clinicForm: FormGroup;
  private clinicSubject = new BehaviorSubject<Clinic | null>(null);

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

  ngOnInit() {
    this.clinicSubject.subscribe((clinic) => {
      if (clinic) {
        this.initializeForm(clinic);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinic'] && this.clinic) {
      this.clinicSubject.next(this.clinic);
    }
  }

  private initializeForm(clinic: Clinic) {
    console.log('Initializing form with clinic:', clinic);
    this.clinicForm.reset();
    const nonArrayFields = {
      id: clinic.id,
      organizationName: clinic.organizationName,
      organisationWebsite: clinic.organisationWebsite,
      organisationalEmail: clinic.organisationalEmail,
      contactEmail: clinic.contactEmail,
      contactPersonName: clinic.contactPersonName,
      contactPersonTitle: clinic.contactPersonTitle,
      listedOnCra: clinic.listedOnCra,
      visibleOnNceo: clinic.visibleOnNceo,
      alternateContactName: clinic.alternateContactName,
      alternateContactTitle: clinic.alternateContactTitle,
      alternateContactEmail: clinic.alternateContactEmail,
      alternateContactPhone: clinic.alternateContactPhone,
      catchmentArea: clinic.catchmentArea,
      appointmentAvailability: clinic.appointmentAvailability,
      publicInfo: clinic.publicInfo,
      wheelchairAccessible: clinic.wheelchairAccessible,
      hoursAndDate: clinic.hoursAndDate,
      yearRoundService: clinic.yearRoundService,
      servePeopleFrom: clinic.servePeopleFrom,
      eligibilityCriteriaWebpage: clinic.eligibilityCriteriaWebpage,
      bookingContactPhone: clinic.bookingContactPhone,
      bookingContactEmail: clinic.bookingContactEmail,
      onlineBookingLink: clinic.onlineBookingLink,
      usefulOnlineBooking: clinic.usefulOnlineBooking,
      bookingDaysHours: clinic.bookingDaysHours,
      requiredDocuments: clinic.requiredDocuments,
      clinicCapacity: clinic.clinicCapacity,
      comments: clinic.comments,
    };
  
    this.clinicForm.patchValue(nonArrayFields);
    this.populateFormArrays(clinic);
    console.log('Form State After Initialization:', this.clinicForm.value);
  }

  private populateFormArrays(clinic: Clinic) {
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
      const values = this.convertToArray((clinic as any)?.[field]);
  
      console.log(`Populating ${field} with values:`, values);
  
      values.forEach((value) => {
        formArray.push(new FormControl(value));
      });
  
      if (values.includes('Other')) {
        this.clinicForm.addControl(
          `${field}Other`,
          new FormControl(clinic?.[`${field}Other`] || '', Validators.required)
        );
      }
    });
  
    const locationsArray = this.clinicForm.get('locations') as FormArray;
    locationsArray.clear();
    (clinic?.locations || []).forEach((loc) => {
      console.log('Adding location:', loc);
      locationsArray.push(this.createLocationGroup(loc));
    });
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
  
      const replaceOtherValue = (field: string, otherField: string) => {
        if (formValue[field]?.includes('Other') && formValue[otherField]) {
          formValue[field] = formValue[field].map((item: string) =>
            item === 'Other' ? formValue[otherField] : item
          );
        }
        delete formValue[otherField];
      };
  
      const fieldsToCheck = [
        { field: 'clinicTypes', other: 'clinicTypesOther' },
        { field: 'monthsOffered', other: 'monthsOfferedOther' },
        { field: 'populationServed', other: 'populationServedOther' },
        { field: 'serviceLanguages', other: 'serviceLanguagesOther' },
        { field: 'taxYearsPrepared', other: 'taxYearsPreparedOther' },
        { field: 'residencyTaxYear', other: 'residencyTaxYearOther' },
        { field: 'servePeople', other: 'servePeopleOther' },
        { field: 'taxPreparers', other: 'taxPreparersOther' },
        { field: 'taxFilers', other: 'taxFilersOther' },
        { field: 'volunteerRoles', other: 'volunteerRolesOther' },
        { field: 'additionalSupport', other: 'additionalSupportOther' },
      ];
  
      fieldsToCheck.forEach(({ field, other }) => replaceOtherValue(field, other));
  
      console.log('Final Data Sent to Backend:', formValue);
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
    const value = event.target.value;
  
    if (event.target.checked) {
      if (!formArray.value.includes(value)) {
        formArray.push(new FormControl(value));
      }
  
      if (value === 'Other') {
        this.clinicForm.addControl(`${controlName}Other`, new FormControl('', Validators.required));
      }
    } else {
      const index = formArray.controls.findIndex(ctrl => ctrl.value === value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
  
      if (value === 'Other') {
        this.clinicForm.removeControl(`${controlName}Other`);
      }
    }
  
    formArray.markAsTouched();
    this.clinicForm.updateValueAndValidity();
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

  atLeastOneRequired(form: AbstractControl) {
    const website = form.get('organisationWebsite')?.value?.trim();
    const email = form.get('organisationalEmail')?.value?.trim();
  
    if (!website && !email) {
      return { atLeastOneRequired: true };
    }
  
    return null;
  }
}
