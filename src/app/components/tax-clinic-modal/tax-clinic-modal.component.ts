import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { Location } from '../../models/location.model';
import { ClinicService } from '../../services/clinic.service';
import {
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
  styleUrl: './tax-clinic-modal.component.scss',
})
export class TaxClinicModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() clinic: Clinic | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() clinicSaved = new EventEmitter<void>();

  clinicForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private clinicService: ClinicService) {
    this.clinicForm = this.fb.group({
      id: [0],
      organizationName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPersonName: ['', Validators.required],
      organizationContact: ['', Validators.required],
      contactPersonTitle: [''],
      listedOnCra: ['no'],
      visibleOnNceo: ['no'],
      alternateContactName: [''],
      alternateContactTitle: [''],
      alternateContactEmail: [''],
      alternateContactPhone: [''],
      catchmentArea: [''],
      locations: this.fb.array([], Validators.required),
      appointmentAvailability: [''],
      publicInfo: [''],
      wheelchairAccessible: [false],
      clinicTypes: this.fb.array([], Validators.required),
      monthsOffered: this.fb.array([], Validators.required),
      daysOfOperation: this.fb.array([], Validators.required),
      hoursOfOperation: this.fb.array([], Validators.required),
      yearRoundService: ['', Validators.required],
      servePeopleFrom: [''],
      taxYearsPrepared: this.fb.array([], Validators.required),
      taxYearsPreparedOther: [''],
      residencyTaxYear: this.fb.array([], Validators.required),
      residencyTaxYearOther: [''],
      servePeople: this.fb.array([], Validators.required),
      servePeopleOther: [''],
      eligibilityCriteriaWebpage: [''],
      populationServed: this.fb.array([]),
      populationServedOther: [''],
      serviceLanguages: this.fb.array([], Validators.required),
      serviceLanguagesOther: [''],
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
    });
  }

  ngOnInit(): void {
    if (this.clinic) {
      this.isEditMode = !!this.clinic.id;
      this.clinicForm.patchValue(this.clinic);
      // If clinic has locations, populate them
      if (this.clinic.locations?.length) {
        this.clinic.locations.forEach((loc) => this.addLocation(loc));
      } else {
        // If no locations exist, add a default empty location
        this.addLocation();
      }
    } else {
      // If adding a new clinic, ensure a default empty location exists
      this.addLocation();
    }
  }

  saveClinic(): void {
    if (this.clinicForm.invalid) return;

    const clinicData = this.clinicForm.value;
    if (this.isEditMode) {
      // Update existing clinic
      this.clinicService.updateTaxClinic(clinicData.id, clinicData).subscribe(
        () => {
          this.clinicSaved.emit();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating clinic:', error);
        }
      );
    } else {
      // Add new clinic
      this.clinicService.addTaxClinic(clinicData).subscribe(
        () => {
          this.clinicSaved.emit();
          this.closeModal();
        },
        (error) => {
          console.error('Error adding clinic:', error);
        }
      );
    }
  }

  closeModal(): void {
    this.closeModalEvent.emit();
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

  onCheckboxChange(controlName: string, event: any) {
    const checkArray = this.clinicForm.get(controlName) as FormArray;
    if (event.target.checked) {
      checkArray.push(new FormControl(event.target.value));
    } else {
      let index = checkArray.controls.findIndex(
        (x) => x.value === event.target.value
      );
      checkArray.removeAt(index);
    }
  }

  createLocationGroup(location?: Location): FormGroup {
    return this.fb.group({
      id: [location?.id || 0],
      taxClinicId: [location?.taxClinicId || 0],
      street: [location?.street || '', Validators.required],
      city: [location?.city || '', Validators.required],
      state: [location?.state || '', Validators.required],
      postalCode: [location?.postalCode || '', Validators.required],
      createdDate: [location?.createdDate || new Date().toISOString()],
      updatedDate: [location?.updatedDate || new Date().toISOString()],
    });
  }

  // Function to add a new location
  addLocation(location?: Location): void {
    (this.clinicForm.get('locations') as FormArray).push(
      this.createLocationGroup(location)
    );
  }

  // Function to remove a location
  removeLocation(index: number): void {
    (this.clinicForm.get('locations') as FormArray).removeAt(index);
  }

  // Helper function to get locations as FormArray
  get locationsFormArray(): FormArray {
    return this.clinicForm.get('locations') as FormArray;
  }
}
