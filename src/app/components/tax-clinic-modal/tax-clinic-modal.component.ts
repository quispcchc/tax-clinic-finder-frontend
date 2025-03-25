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
  ValidationErrors,
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
      locations: this.fb.array([]),
      isVirtualClinic: [false],
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
      eligibilityCriteriaFile:[''],
      otherBranches: [''],
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
    {  validators: [
      this.atLeastOneRequired.bind(this),
      this.virtualOrLocationValidator.bind(this)
    ] }
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
    } else if (changes['isEditMode'] && !this.isEditMode) {
      this.clinicForm.reset();
      this.clearDynamicControls();
      this.clinicForm.patchValue({ servePeopleFrom: '' });
    }
  }

  virtualOrLocationValidator(form: AbstractControl): ValidationErrors | null {
    const isVirtual = form.get('isVirtualClinic')?.value;
    const locations = form.get('locations') as FormArray;
    
    if (this.isEditMode) {
      if (!isVirtual && locations.length === 0) {
        return { virtualOrLocationRequired: true };
      }
      return null;
    }
    
    if (form.get('isVirtualClinic')?.dirty || locations.dirty) {
      if (!isVirtual && locations.length === 0) {
        return { virtualOrLocationRequired: true };
      }
    }
    return null;
  }

  onVirtualClinicChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    this.clinicForm.get('isVirtualClinic')?.setValue(isChecked);
    
    if (isChecked) {
      const locations = this.clinicForm.get('locations') as FormArray;
      while (locations.length > 0) {
        locations.removeAt(0);
      }
    }
    
    this.clinicForm.get('isVirtualClinic')?.markAsTouched();
    this.clinicForm.get('locations')?.markAsTouched();
    
    this.clinicForm.updateValueAndValidity();
  }

  private standardOptions: { [key: string]: string[] } = {
    clinicTypes: ['Virtual', 'In person', 'By appointment', 'Walk-in', 'Drop-off'],
    monthsOffered: ['February', 'March', 'April', 'May', 'June'],
    populationServed: ['Seniors', 'Persons with disabilities', 'Newcomers', 'Language-specific community', 'Indigenous (First Nations and Inuit and Metis)', 'Students'],
    serviceLanguages: ['English', 'French', 'Arabic'],
    taxYearsPrepared: ['Only current year', 'Current and last year', 'Multiple years'],
    residencyTaxYear: ['Ontario', 'Quebec', 'Any province other than Ontario and Quebec'],
    servePeople: ['Rental income', 'Self-employment income', 'Interest income over $1000', 'Return for a deceased person', 'Employment expenses (with specific conditions)', 
      'Capital Gains/losses (with specific conditions)', 'Larger income than CVITP income-criteria. when people are low income now'],
    taxPreparers: ['Volunteers', 'Employees'],
    taxFilers: ['Volunteers', 'Employees'],
    volunteerRoles: ['Booking appointments', 'Client intake (gathering personal information and tax slips)', 'Preparing tax returns using software',
      'Explaining tax return to client and having them sign e-filing authorization', 'Tax return verification/audit before e-filing', 'E-FILE tax returns',
      'Administrative tasks'],
    additionalSupport: ['Volunteer recruitment', 'Volunteer training', 'Training of employees new to operating tax clinics', 'Follow-up with clients post-tax season',
      'Visibility for your tax clinic to reach more clients', 'Set up an online booking system']
  };

  private initializeForm(clinic: Clinic) {
    this.clearDynamicControls();
    this.clinicForm.reset();

    const locationsArray = this.clinicForm.get('locations') as FormArray;
    locationsArray.clear();

    this.clinicForm.patchValue({ isVirtualClinic: clinic.isVirtualClinic });
    if (!clinic.isVirtualClinic) {
      (clinic?.locations || []).forEach((loc) => {
        locationsArray.push(this.createLocationGroup(loc));
      });
    }

    if (!this.isEditMode) {
      this.clinicForm.patchValue({ servePeopleFrom: '' });
    }

    const servePeopleFromValue = clinic.servePeopleFrom;
    const isCustomValue =
      servePeopleFromValue &&
      servePeopleFromValue !== 'A specific catchment area only' &&
      servePeopleFromValue !== 'Anywhere from Ottawa' &&
      servePeopleFromValue !== 'Other';

    if (servePeopleFromValue === 'Other' || isCustomValue) {
      const customValue = isCustomValue ? servePeopleFromValue : clinic["servePeopleFromOther"] || '';
      this.clinicForm.addControl(
        'servePeopleFromOther',
        new FormControl(customValue, Validators.required)
      );
    }

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
      servePeopleFrom:  isCustomValue ? 'Other' : clinic.servePeopleFrom,
      eligibilityCriteriaWebpage: clinic.eligibilityCriteriaWebpage,
      eligibilityCriteriaFile: clinic.eligibilityCriteriaFile,
      otherBranches: clinic.otherBranches,
      bookingContactPhone: clinic.bookingContactPhone,
      bookingContactEmail: clinic.bookingContactEmail,
      onlineBookingLink: clinic.onlineBookingLink,
      usefulOnlineBooking: clinic.usefulOnlineBooking,
      bookingDaysHours: clinic.bookingDaysHours,
      requiredDocuments: clinic.requiredDocuments,
      clinicCapacity: clinic.clinicCapacity,
      comments: clinic.comments,
      isVirtualClinic: clinic.isVirtualClinic
    };
  
    this.clinicForm.patchValue(nonArrayFields);
    this.populateFormArrays(clinic);
    this.reAddDynamicControls(clinic);
  }

  private clearDynamicControls() {
    const fieldsToCheck = [
      'clinicTypes',
      'monthsOffered',
      'populationServed',
      'serviceLanguages',
      'taxYearsPrepared',
      'residencyTaxYear',
      'servePeople',
      'taxPreparers',
      'taxFilers',
      'volunteerRoles',
      'additionalSupport',
    ];
  
    fieldsToCheck.forEach((field) => {
      const otherControlName = `${field}Other`;
      if (this.clinicForm.contains(otherControlName)) {
        this.clinicForm.removeControl(otherControlName);
      }
    });
    if (this.clinicForm.contains('servePeopleFromOther')) {
      this.clinicForm.removeControl('servePeopleFromOther');
    }
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
  
      if (this.standardOptions[field]) {
        const standardValues = values.filter((value) =>
          this.standardOptions[field].includes(value)
        );
        const customValues = values.filter(
          (value) => !this.standardOptions[field].includes(value)
        );
  
        standardValues.forEach((value) => {
          formArray.push(new FormControl(value));
        });
  
        if (customValues.length > 0) {
          formArray.push(new FormControl('Other'));
        }
      } else {
        values.forEach((value) => {
          formArray.push(new FormControl(value));
        });
      }
    });
  
    const locationsArray = this.clinicForm.get('locations') as FormArray;
    locationsArray.clear();
    (clinic?.locations || []).forEach((loc) => {
      locationsArray.push(this.createLocationGroup(loc));
    });
  }

  private reAddDynamicControls(clinic: Clinic) {
    const fieldsToCheck = [
      'clinicTypes',
      'monthsOffered',
      'populationServed',
      'serviceLanguages',
      'taxYearsPrepared',
      'residencyTaxYear',
      'servePeople',
      'taxPreparers',
      'taxFilers',
      'volunteerRoles',
      'additionalSupport',
    ];
  
    fieldsToCheck.forEach((field) => {
      const formArray = this.clinicForm.get(field) as FormArray;
      const values = this.convertToArray((clinic as any)?.[field]);
  
      const customValues = values.filter(
        (value) => !this.standardOptions[field]?.includes(value)
      );
  
      if (customValues.length > 0) {
        if (!formArray.value.includes('Other')) {
          formArray.push(new FormControl('Other'));
        }
  
        const otherControlName = `${field}Other`;
        if (!this.clinicForm.contains(otherControlName)) {
          this.clinicForm.addControl(
            otherControlName,
            new FormControl(customValues.join(', '), Validators.required)
          );
        } else {
          this.clinicForm.get(otherControlName)?.setValue(customValues.join(', '));
        }
      }
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
        isVirtualClinic: this.clinicForm.value.isVirtualClinic,
        locations: this.clinicForm.value.isVirtualClinic ? [] : 
        this.clinicForm.value.locations.map((loc: Location) => ({
          ...loc,
          taxClinicId: this.isEditMode ? this.clinic?.id : undefined,
        })),
      };

      if (formValue.servePeopleFrom === 'Other' && formValue.servePeopleFromOther) {
        formValue.servePeopleFrom = formValue.servePeopleFromOther;
      }
      delete formValue.servePeopleFromOther;
  
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
    this.clinicForm.get('isVirtualClinic')?.setValue(false);
    
    (this.clinicForm.get('locations') as FormArray).push(
      this.createLocationGroup(location)
    );
    
    this.clinicForm.get('locations')?.markAsTouched();
    this.clinicForm.updateValueAndValidity();
  }
  
  removeLocation(index: number): void {
    (this.clinicForm.get('locations') as FormArray).removeAt(index);
    
    if (this.locationsFormArray.length === 0) {
      this.clinicForm.get('locations')?.markAsTouched();
      this.clinicForm.updateValueAndValidity();
    }
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
        this.clinicForm.addControl(
          `${controlName}Other`,
          new FormControl('', Validators.required)
        );
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
    if (event.target.value === 'Other') {
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

  isVirtualClinicTouched(): boolean {
    return this.clinicForm.get('isVirtualClinic')?.dirty || false;
  }
  
  locationsTouched(): boolean {
    return (this.clinicForm.get('locations') as FormArray).dirty || false;
  }

  showVirtualClinicRequired(): boolean {
    const isVirtual = this.clinicForm.get('isVirtualClinic')?.value;
    const hasLocations = this.locationsFormArray.length > 0;
    return !isVirtual && !hasLocations;
  }
  
  showLocationRequired(): boolean {
    const isVirtual = this.clinicForm.get('isVirtualClinic')?.value;
    const hasLocations = this.locationsFormArray.length > 0;
    return !isVirtual && !hasLocations;
  }
}
