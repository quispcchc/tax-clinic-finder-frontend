import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
  OnDestroy,
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
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-tax-clinic-modal',
  standalone: false,
  templateUrl: './tax-clinic-modal.component.html',
  styleUrls: ['./tax-clinic-modal.component.scss'],
})
export class TaxClinicModalComponent implements OnChanges, OnInit, OnDestroy  {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() clinic: Clinic | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Clinic>();

  uploadProgress = 0;
  fileName = '';
  currentGeoJsonFile: File | null = null;
  geoJsonData: any = null;
  currentLanguage: string;

  clinicForm: FormGroup;
  private clinicSubject = new BehaviorSubject<Clinic | null>(null);

  private valueMappings: { [key: string]: { [lang: string]: { [value: string]: string } } } = {
    listedOnCra: {
      en: { 'Yes': 'Yes', 'No': 'No', 'I dont know': 'I do not know' },
      fr: { 'Yes': 'Oui', 'No': 'Non', 'I dont know': 'Je ne sais pas' }
    },
    visibleOnNceo: {
      en: { 'Yes': 'Yes', 'No': 'No', 'I do not know': 'I do not know' },
      fr: { 'Yes': 'Oui', 'No': 'Non', 'I do not know': 'Je ne sais pas' }
    },
    appointmentAvailability: {
      en: { 'Yes': 'Yes', 'No': 'No', 'Might be available soon': 'Might be available soon' },
      fr: { 'Yes': 'Oui', 'No': 'Non', 'Might be available soon': 'Pourrait être bientôt disponible' }
    },
    publicInfo: {
      en: { 'Yes': 'Yes', 'No, only for EBO': 'No, only for EBO', 'Maybe but needs more info': 'Maybe but needs more info' },
      fr: { 'Yes': 'Oui', 'No, only for EBO': 'Non, uniquement pour EBO', 'Maybe but needs more info': 'Peut-être mais a besoin de plus d\'informations' }
    },
    wheelchairAccessible: {
      en: { 'Yes': 'Yes', 'No': 'No' },
      fr: { 'Yes': 'Oui', 'No': 'Non' }
    },
    yearRoundService: {
      en: { 'Yes': 'Yes', 'No': 'No' },
      fr: { 'Yes': 'Oui', 'No': 'Non' }
    },
    servePeopleFrom: {
      en: { 
        'A specific catchment area only': 'A specific catchment area only',
        'Anywhere from Ottawa': 'Anywhere from Ottawa'
      },
      fr: { 
        'A specific catchment area only': 'Uniquement une zone de chalandise spécifique',
        'Anywhere from Ottawa': 'Toute personne à Ottawa'
      }
    },
    usefulOnlineBooking: {
      en: { 'Yes': 'Yes', 'No': 'No', 'Maybe': 'Maybe' },
      fr: { 'Yes': 'Oui', 'No': 'Non', 'Maybe': 'Peut-être' }
    },
    clinicTypes: {
      en: {
        'Virtual': 'Virtual',
        'In person': 'In person',
        'By appointment': 'By appointment',
        'Walk-in': 'Walk-in',
        'Drop-off': 'Drop-off'
      },
      fr: {
        'Virtual': 'Virtuelle',
        'In person': 'En présentiel',
        'By appointment': 'Sur rendez-vous',
        'Walk-in': 'Sans rendez-vous',
        'Drop-off': 'Dépôt'
      }
    },
    monthsOffered: {
      en: {
        'February': 'February',
        'March': 'March',
        'April': 'April',
        'May': 'May',
        'June': 'June'
      },
      fr: {
        'February': 'Février',
        'March': 'Mars',
        'April': 'Avril',
        'May': 'Mai',
        'June': 'Juin'
      }
    },
    daysOfOperation: {
      en: {
        'Weekdays': 'Weekdays',
        'Weekends': 'Weekends'
      },
      fr: {
        'Weekdays': 'jours de la semaine',
        'Weekends': 'Weekends'
      }
    },
    hoursOfOperation: {
      en: {
        'Daytime': 'Daytime',
        'Evening': 'Evening'
      },
      fr: {
        'Daytime': 'heures de bureau',
        'Evening': 'soirée'
      }
    },
    populationServed: {
      en: {
        'Seniors': 'Seniors',
        'Persons with disabilities': 'Persons with disabilities',
        'Newcomers': 'Newcomers',
        'Language-specific community': 'Language-specific community',
        'Indigenous (First Nations and Inuit and Metis)': 'Indigenous (First Nations and Inuit and Metis)',
        'Students': 'Students'
      },
      fr: {
        'Seniors': 'Personnes âgées',
        'Persons with disabilities': 'Personnes en situation de handicap',
        'Newcomers': 'Nouveaux arrivants',
        'Language-specific community': 'Communauté spécifique à une langue',
        'Indigenous (First Nations and Inuit and Metis)': 'Autochtones (Premières Nations et Inuits et Métis)',
        'Students': 'Étudiants'
      }
    },
    serviceLanguages: {
      en: {
        'English': 'English',
        'French': 'French',
        'Arabic': 'Arabic'
      },
      fr: {
        'English': 'Anglais',
        'French': 'Français',
        'Arabic': 'Arabe'
      }
    },
    taxYearsPrepared: {
      en: {
        'Only current year': 'Only current year',
        'Current and last year': 'Current and last year',
        'Multiple years': 'Multiple years'
      },
      fr: {
        'Only current year': 'Année en cours seule',
        'Current and last year': 'Année en cours et dernière année',
        'Multiple years': 'Plusieurs années'
      }
    },
    residencyTaxYear: {
      en: {
        'Ontario': 'Ontario',
        'Quebec': 'Quebec',
        'Any province other than Ontario and Quebec': 'Any province other than Ontario and Quebec'
      },
      fr: {
        'Ontario': 'Ontario',
        'Quebec': 'Québec',
        'Any province other than Ontario and Quebec': 'Toute autre province que l\'Ontario et le Québec'
      }
    },
    servePeople: {
      en: {
        'Rental income': 'Rental income',
        'Self-employment income': 'Self-employment income',
        'Interest income over $1000': 'Interest income over $1000',
        'Return for a deceased person': 'Return for a deceased person',
        'Employment expenses (with specific conditions)': 'Employment expenses (with specific conditions)',
        'Capital Gains/losses (with specific conditions)': 'Capital Gains/losses (with specific conditions)',
        'Larger income than CVITP income-criteria. when people are low income now': 'Larger income than CVITP income-criteria. when people are low income now'
      },
      fr: {
        'Rental income': 'Revenus locatifs',
        'Self-employment income': 'Revenu d\'un travail indépendant',
        'Interest income over $1000': 'Revenu d\'intérêts supérieur à 1000$',
        'Return for a deceased person': 'Déclarations pour une personne décédée',
        'Employment expenses (with specific conditions)': 'Dépenses d’emploi (sous conditions spécifiques)',
        'Capital Gains/losses (with specific conditions)': 'Gains/pertes en capital (avec conditions spécifiques)',
        'Larger income than CVITP income-criteria. when people are low income now': 'Revenu supérieur aux critères de revenu du cvitp. lorsque les personnes ont un faible revenu actuellement'
      }
    },
    bookingProcess: {
      en: {
        'In person': 'In person',
        'By phone': 'By phone',
        'Online': 'Online'
      },
      fr: {
        'In person': 'En personne',
        'By phone': 'Par téléphone',
        'Online': 'En ligne'
      }
    },
    helpWithMissingDocs: {
      en: {
        'Yes for CRA documents with Autofill/repid': 'Yes for CRA documents with Autofill/repid',
        'Yes with help from staff or volunteer for some documentation': 'Yes with help from staff or volunteer for some documentation',
        'No client must have all their documents ready': 'No client must have all their documents ready'
      },
      fr: {
        'Yes for CRA documents with Autofill/repid': 'Oui pour les documents de l’ARC avec Autofill/repid',
        'Yes with help from staff or volunteer for some documentation': 'Oui avec l’aide du personnel ou des bénévoles pour certains documents',
        'No client must have all their documents ready': 'Non le client doit avoir tous ses documents prêts'
      }
    },
    taxPreparers: {
      en: {
        'Volunteers': 'Volunteers',
        'Employees': 'Employees'
      },
      fr: {
        'Volunteers': 'Bénévoles',
        'Employees': 'Employés'
      }
    },
    taxFilers: {
      en: {
        'Volunteers': 'Volunteers',
        'Employees': 'Employees'
      },
      fr: {
        'Volunteers': 'Bénévoles',
        'Employees': 'Employés'
      }
    },
    volunteerRoles: {
      en: {
        'Booking appointments': 'Booking appointments',
        'Client intake (gathering personal information and tax slips)': 'Client intake (gathering personal information and tax slips)',
        'Preparing tax returns using software': 'Preparing tax returns using software',
        'Explaining tax return to client and having them sign e-filing authorization': 'Explaining tax return to client and having them sign e-filing authorization',
        'Tax return verification/audit before e-filing': 'Tax return verification/audit before e-filing',
        'E-FILE tax returns': 'E-FILE tax returns',
        'Administrative tasks': 'Administrative tasks'
      },
      fr: {
        'Booking appointments': 'Prise de rendez-vous',
        'Client intake (gathering personal information and tax slips)': 'Accueil des clients (collecte des informations personnelles et feuillets d\'impôt)',
        'Preparing tax returns using software': 'Préparation des déclarations d\'impôt avec un logiciel',
        'Explaining tax return to client and having them sign e-filing authorization': 'Explication de la déclaration au client et signature de l’autorisation de transmission (TED)',
        'Tax return verification/audit before e-filing': 'Vérification/audit avant transmission (TED)',
        'E-FILE tax returns': 'transmission électronique des déclarations (TED)',
        'Administrative tasks': 'Tâches administratives'
      }
    },
    additionalSupport: {
      en: {
        'Volunteer recruitment': 'Volunteer recruitment',
        'Volunteer training': 'Volunteer training',
        'Training of employees new to operating tax clinics': 'Training of employees new to operating tax clinics',
        'Follow-up with clients post-tax season': 'Follow-up with clients post-tax season',
        'Visibility for your tax clinic to reach more clients': 'Visibility for your tax clinic to reach more clients',
        'Set up an online booking system': 'Set up an online booking system'
      },
      fr: {
        'Volunteer recruitment': 'Recrutement de bénévoles',
        'Volunteer training': 'Formation des bénévoles',
        'Training of employees new to operating tax clinics': 'Formation des employés nouveaux dans la gestion des cliniques d\'impôt',
        'Follow-up with clients post-tax season': 'Suivi avec les clients après la saison des impôts',
        'Visibility for your tax clinic to reach more clients': 'Visibilité pour votre clinique d\'impôt afin d’atteindre plus de clients',
        'Set up an online booking system': 'Mise en place d’un système de prise de rendez-vous en ligne'
      }
    }

  };

  private languageSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private translateService: TranslateService, private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
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
      catchmentBoundariesData: [null, [this.validateGeoJson.bind(this)]],
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
    this.languageSubscription = this.languageService.languageChanged.subscribe((lang: string) => {
      this.currentLanguage = lang;
      if (this.clinic) {
        const translatedClinic = this.translateClinicData(this.clinic, this.currentLanguage);
        this.initializeForm(translatedClinic);
      }
    });

    this.clinicSubject.subscribe((clinic) => {
      if (clinic) {
        this.initializeForm(clinic);
      }
    });
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinic'] && this.clinic) {
      this.resetGeoJsonState();
      if (this.clinic.catchmentBoundaries) {
        try {
          const geoJsonData = typeof this.clinic.catchmentBoundaries === 'string' 
            ? JSON.parse(this.clinic.catchmentBoundaries)
            : this.clinic.catchmentBoundaries;
      
          const validationErrors = this.validateGeoJson({ value: geoJsonData } as AbstractControl);
          
          if (!validationErrors) {
            const control = this.clinicForm.get('catchmentBoundariesData');
            control?.setValidators([this.validateGeoJson.bind(this)]);
            control?.setValue(JSON.stringify(geoJsonData));
            control?.updateValueAndValidity();
            
            this.geoJsonData = geoJsonData;
            this.fileName = 'Existing GeoJSON data';
          }
        } catch (error) {
          console.error('Error parsing catchmentBoundaries:', error);
          this.clinicForm.get('catchmentBoundariesData')?.setErrors({ invalidGeoJson: true });
        }
      }
      
      this.translateService.onLangChange.pipe(take(1)).subscribe(() => {
        this.clinicSubject.next(this.clinic);
      });
      this.clinicSubject.next(this.clinic);
    } else if (changes['isEditMode'] && !this.isEditMode) {
      this.clinicForm.reset();
      this.clearDynamicControls();
      this.clinicForm.patchValue({ servePeopleFrom: '' });
      this.resetGeoJsonState();
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
    const translatedClinic = this.translateClinicData(clinic, this.currentLanguage);

    const locationsArray = this.clinicForm.get('locations') as FormArray;
    locationsArray.clear();

    this.clinicForm.patchValue({ isVirtualClinic: translatedClinic.isVirtualClinic });
    if (!translatedClinic.isVirtualClinic) {
      (translatedClinic?.locations || []).forEach((loc) => {
        locationsArray.push(this.createLocationGroup(loc));
      });
    }

    if (!this.isEditMode) {
      this.clinicForm.patchValue({ servePeopleFrom: '' });
    }

    const servePeopleFromValue = translatedClinic.servePeopleFrom;
    const isCustomValue =
      servePeopleFromValue &&
      servePeopleFromValue !== this.translateValue('servePeopleFrom', 'A specific catchment area only', this.currentLanguage) &&
      servePeopleFromValue !== this.translateValue('servePeopleFrom', 'Anywhere from Ottawa', this.currentLanguage) &&
      servePeopleFromValue !== this.translateValue('servePeopleFrom', 'Other', this.currentLanguage);
  
    if (servePeopleFromValue === this.translateValue('servePeopleFrom', 'Other', this.currentLanguage) || isCustomValue) {
      const customValue = isCustomValue ? servePeopleFromValue : translatedClinic["servePeopleFromOther"] || '';
      this.clinicForm.addControl(
        'servePeopleFromOther',
        new FormControl(customValue, Validators.required)
      );
    }

    const nonArrayFields = {
      id: translatedClinic.id,
      organizationName: translatedClinic.organizationName,
      organisationWebsite: translatedClinic.organisationWebsite,
      organisationalEmail: translatedClinic.organisationalEmail,
      contactEmail: translatedClinic.contactEmail,
      contactPersonName: translatedClinic.contactPersonName,
      contactPersonTitle: translatedClinic.contactPersonTitle,
      listedOnCra: translatedClinic.listedOnCra,
      visibleOnNceo: translatedClinic.visibleOnNceo,
      alternateContactName: translatedClinic.alternateContactName,
      alternateContactTitle: translatedClinic.alternateContactTitle,
      alternateContactEmail: translatedClinic.alternateContactEmail,
      alternateContactPhone: translatedClinic.alternateContactPhone,
      catchmentArea: translatedClinic.catchmentArea,
      catchmentBoundariesData: translatedClinic.catchmentBoundaries,
      appointmentAvailability: translatedClinic.appointmentAvailability,
      publicInfo: translatedClinic.publicInfo,
      wheelchairAccessible: translatedClinic.wheelchairAccessible,
      hoursAndDate: translatedClinic.hoursAndDate,
      yearRoundService: translatedClinic.yearRoundService,
      servePeopleFrom:  isCustomValue ? 'Other' : translatedClinic.servePeopleFrom,
      eligibilityCriteriaWebpage: translatedClinic.eligibilityCriteriaWebpage,
      eligibilityCriteriaFile: translatedClinic.eligibilityCriteriaFile,
      otherBranches: translatedClinic.otherBranches,
      bookingContactPhone: translatedClinic.bookingContactPhone,
      bookingContactEmail: translatedClinic.bookingContactEmail,
      onlineBookingLink: translatedClinic.onlineBookingLink,
      usefulOnlineBooking: translatedClinic.usefulOnlineBooking,
      bookingDaysHours: translatedClinic.bookingDaysHours,
      requiredDocuments: translatedClinic.requiredDocuments,
      clinicCapacity: translatedClinic.clinicCapacity,
      comments: translatedClinic.comments,
      isVirtualClinic: translatedClinic.isVirtualClinic
    };
  
    this.clinicForm.patchValue(nonArrayFields);
    this.populateFormArrays(translatedClinic);
    this.reAddDynamicControls(translatedClinic);
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

      const englishValues = values.map(value => {
        const englishKey = this.findEnglishKey(field, value);
        return englishKey || value;
      });

      if (this.standardOptions[field]) {
        const standardValues = englishValues.filter((value) =>
          this.standardOptions[field].includes(value)
        );
        const customValues = englishValues.filter(
          (value) => !this.standardOptions[field].includes(value)
        );

        standardValues.forEach((value) => {
          formArray.push(new FormControl(value));
        });

        if (customValues.length > 0) {
          formArray.push(new FormControl('Other'));
        }
      } else {
        englishValues.forEach((value) => {
          formArray.push(new FormControl(value));
        });
      }
    });
  }

  private findEnglishKey(field: string, translatedValue: string): string | null {
    if (!this.valueMappings[field]) return null;
    
    if (this.valueMappings[field]['en'][translatedValue]) {
      return translatedValue;
    }
    
    for (const [key, enValue] of Object.entries(this.valueMappings[field]['en'])) {
      if (enValue === translatedValue) return key;
      
      if (this.valueMappings[field]['fr'] && 
          this.valueMappings[field]['fr'][key] === translatedValue) {
        return key;
      }
    }
    
    return null;
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
      const formValue = JSON.parse(JSON.stringify(this.clinicForm.value));
      
      const fieldsWithOther = [
        'clinicTypes', 'monthsOffered', 'populationServed', 'serviceLanguages',
        'taxYearsPrepared', 'residencyTaxYear', 'servePeople', 'taxPreparers',
        'taxFilers', 'volunteerRoles', 'additionalSupport'
      ];
  
      fieldsWithOther.forEach(field => {
        const otherField = `${field}Other`;
        if (formValue[field]?.includes('Other') && formValue[otherField]) {
          formValue[field] = formValue[field].map((item: string) => 
            item === 'Other' ? formValue[otherField] : item
          );
          delete formValue[otherField];
        }
      });
  
      if (formValue.servePeopleFrom === 'Other' && formValue['servePeopleFromOther']) {
        formValue.servePeopleFrom = formValue['servePeopleFromOther'];
        delete formValue['servePeopleFromOther'];
      }

      if (formValue.appointmentAvailability) {
        formValue.appointmentAvailability = this.translateAppointmentToEnglish(formValue.appointmentAvailability);
      }
  
      const finalData = {
        ...formValue,
        catchmentBoundaries: formValue.catchmentBoundariesData,
        isVirtualClinic: formValue.isVirtualClinic,
        locations: formValue.isVirtualClinic ? [] : 
          formValue.locations.map((loc: Location) => ({
            ...loc,
            taxClinicId: this.isEditMode ? this.clinic?.id : undefined,
          })),
      };
  
      const translatedFormValue = this.translateForSaving(finalData, this.currentLanguage);
      this.save.emit(translatedFormValue);
    }
  }

  private translateAppointmentToEnglish(value: string): string {
    const frenchToEnglishMap: Record<string, string> = {
      'Oui': 'Yes',
      'Non': 'No',
      'Pourrait être bientôt disponible': 'Might be available soon'
    };
  
    return frenchToEnglishMap[value] || value;
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

  onGeoJsonUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      this.clinicForm.get('catchmentBoundariesData')?.setErrors({ required: true });
      return;
    }
  
    this.fileName = file.name;
    this.uploadProgress = 10;
    
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const geoJson = JSON.parse(e.target?.result as string);
        this.uploadProgress = 90;
        
        const validationErrors = this.validateGeoJson({ value: geoJson } as AbstractControl);
        
        if (!validationErrors) {
          this.currentGeoJsonFile = file;
          this.geoJsonData = geoJson;

          this.clinicForm.get('catchmentBoundariesData')?.setValue(JSON.stringify(geoJson));
          this.clinicForm.get('catchmentBoundariesData')?.updateValueAndValidity();
          
          this.uploadProgress = 100;
          setTimeout(() => this.uploadProgress = 0, 2000);
        } else {
          this.handleGeoJsonError(input, validationErrors);
        }
      } catch (error) {
        this.handleGeoJsonError(input, { invalidGeoJson: { reason: 'Invalid JSON format' } });
      }
    };
  
    reader.onerror = () => {
      this.handleGeoJsonError(input, { fileReadError: true });
    };
    
    reader.readAsText(file);
    setTimeout(() => { input.value = ''; }, 100);
  }
  
  private handleGeoJsonError(input: HTMLInputElement, errors: ValidationErrors) {
    input.value = '';
    this.clearGeoJsonInput(input);
    this.clinicForm.get('catchmentBoundariesData')?.setErrors(errors);
    this.uploadProgress = 0;
  }
  
  private clearGeoJsonInput(input: HTMLInputElement) {
    input.value = '';
    this.fileName = '';
  }

  clearGeoJson() {
    const input = document.getElementById('geoJsonUpload') as HTMLInputElement;
    if (input) input.value = '';
    
    this.currentGeoJsonFile = null;
    this.geoJsonData = null;
    this.fileName = '';
    this.uploadProgress = 0;
    
    const control = this.clinicForm.get('catchmentBoundaries');
    control?.setValue(null);
    control?.setValidators([this.validateGeoJson.bind(this)]);
    control?.updateValueAndValidity();
  }

  removeFile() {
    this.resetGeoJsonState();
  }

  validateGeoJson(control: AbstractControl): ValidationErrors | null {
    let geoJson = control.value;
  
    if (!geoJson) {
      return null;
    }

    try {
      if (typeof geoJson === 'string') {
        geoJson = JSON.parse(geoJson);
      }
    } catch (error) {
      return { invalidGeoJson: { reason: 'Invalid JSON format' } };
    }
  
    if (typeof geoJson !== 'object' || geoJson === null) {
      return { invalidGeoJson: { reason: 'Not a valid object' } };
    }
  
    if (geoJson.type !== 'FeatureCollection') {
      return { invalidGeoJson: { reason: 'Must be a FeatureCollection' } };
    }
  
    if (!Array.isArray(geoJson.features)) {
      return { invalidGeoJson: { reason: 'Features must be an array' } };
    }
  
    for (const feature of geoJson.features) {
      if (!feature || typeof feature !== 'object') {
        return { invalidGeoJson: { reason: 'Invalid feature structure' } };
      }
  
      if (feature.type !== 'Feature') {
        return { invalidGeoJson: { reason: 'Features must be of type Feature' } };
      }
  
      if (!feature.geometry || typeof feature.geometry !== 'object') {
        return { invalidGeoJson: { reason: 'Feature missing geometry' } };
      }
  
      const geom = feature.geometry;
      
      const validTypes = ['Polygon', 'MultiPolygon', 'Point', 'LineString'];
      if (!validTypes.includes(geom.type)) {
        return { invalidGeoJson: { reason: `Unsupported geometry type: ${geom.type}` } };
      }
  
      if (!Array.isArray(geom.coordinates)) {
        return { invalidGeoJson: { reason: 'Coordinates must be an array' } };
      }
  
      if (geom.type === 'Polygon') {
        if (geom.coordinates.length === 0) {
          return { invalidGeoJson: { reason: 'Polygon coordinates empty' } };
        }
  
        const firstRing = geom.coordinates[0];
        if (firstRing.length < 4) {
          return { invalidGeoJson: { reason: 'Polygon must have at least 4 points' } };
        }
  
        const first = firstRing[0];
        const last = firstRing[firstRing.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          return { invalidGeoJson: { reason: 'Polygon is not closed' } };
        }
      }
    }
    return null;
  }

  private resetGeoJsonState() {
    this.fileName = '';
    this.currentGeoJsonFile = null;
    this.geoJsonData = null;
    this.uploadProgress = 0;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.clinicForm.get('catchmentBoundariesData')?.reset();
  }

    private translateClinicData(clinic: Clinic, targetLang: string): Clinic {
    const translated = { ...clinic };
    
    const displayLang = 'en';
    
    const radioFields = ['listedOnCra', 'visibleOnNceo', 'appointmentAvailability', 
      'publicInfo', 'wheelchairAccessible', 'yearRoundService', 'servePeopleFrom', 
      'usefulOnlineBooking'];
    
    radioFields.forEach(field => {
      if (translated[field as keyof Clinic]) {
        translated[field as keyof Clinic] = this.translateValue(
          field, 
          translated[field as keyof Clinic] as string, 
          displayLang
        );
      }
    });

    const checkboxFields = [
      'clinicTypes', 'monthsOffered', 'daysOfOperation', 'hoursOfOperation',
      'populationServed', 'serviceLanguages', 'taxYearsPrepared', 'residencyTaxYear',
      'servePeople', 'bookingProcess', 'helpWithMissingDocs', 'taxPreparers',
      'taxFilers', 'volunteerRoles', 'additionalSupport'
    ];

    checkboxFields.forEach(field => {
      if (translated[field as keyof Clinic]) {
        const values = this.convertToArray(translated[field as keyof Clinic]);
        translated[field as keyof Clinic] = values.map(value => 
          this.translateValue(field, value, displayLang)
        );
      }
    });

    return translated;
  }

  private translateForSaving(clinic: Clinic, targetLang: string): Clinic {
    const translated = { ...clinic };
    
    const radioFields = ['listedOnCra', 'visibleOnNceo', 
      'publicInfo', 'wheelchairAccessible', 'yearRoundService', 'servePeopleFrom', 
      'usefulOnlineBooking'];
    
    radioFields.forEach(field => {
      if (translated[field as keyof Clinic]) {
        translated[field as keyof Clinic] = this.translateValue(
          field, 
          translated[field as keyof Clinic] as string, 
          targetLang
        );
      }
    });

    const checkboxFields = [
      'clinicTypes', 'monthsOffered', 'daysOfOperation', 'hoursOfOperation',
      'populationServed', 'serviceLanguages', 'taxYearsPrepared', 'residencyTaxYear',
      'servePeople', 'bookingProcess', 'helpWithMissingDocs', 'taxPreparers',
      'taxFilers', 'volunteerRoles', 'additionalSupport'
    ];

    checkboxFields.forEach(field => {
      if (translated[field as keyof Clinic]) {
        const values = this.convertToArray(translated[field as keyof Clinic]);
        translated[field as keyof Clinic] = values.map(value => 
          this.translateValue(field, value, targetLang)
        );
      }
    });

    return translated;
  }

  private translateValue(field: string, value: string, targetLang: string): string {
    if (!this.valueMappings[field] || !value) return value;
    
    const directMatch = Object.entries(this.valueMappings[field][targetLang])
      .find(([key, val]) => val === value);
    if (directMatch) return value;
  
    let sourceKey: string | undefined;
    
    for (const lang of ['en', 'fr']) {
      if (this.valueMappings[field][lang]) {
        sourceKey = Object.keys(this.valueMappings[field][lang]).find(
          key => this.valueMappings[field][lang][key] === value
        );
        if (sourceKey) break;
      }
    }
  
    if (sourceKey && this.valueMappings[field][targetLang][sourceKey]) {
      return this.valueMappings[field][targetLang][sourceKey];
    }
  
    return value;
  }
}
