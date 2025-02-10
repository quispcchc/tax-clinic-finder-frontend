import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<{ [key: string]: any }>();
  @Input() language!: string;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Input() isSidebarOpen: boolean = false;

  filters: {
    appointmentType?: string;
    supportedTaxYears: {
      currentYear?: boolean;
      currentLastYears?: boolean;
      multipleYears?: boolean;
    };
    provinces: { [key: string]: boolean };
    specialTaxCases: {
      selfEmployed?: boolean;
      deceased?: boolean;
      bankruptcy?: boolean;
      imprisoned?: boolean;
    };
    languageOptions: {
      french?: boolean;
      english?: boolean;
      arabic?: boolean;
      other?: boolean;
      otherLanguage?: string;
    };
    serviceDeliveryModes: {
      inPerson?: boolean;
      virtual?: boolean;
      byAppointment?: boolean;
      walkIn?: boolean;
      dropOff?: boolean;
    };
    clientCategories: {
      newcomers?: boolean;
      students?: boolean;
      indigenousClients?: boolean;
      seniors?: boolean;
      disabilities?: boolean;
    };
    accessDocuments: {
      allDocuments?: boolean;
      someDocuments?: boolean;
      noDocuments?: boolean;
    };
    catchmentArea: {
      hasCatchmentArea?: boolean;
      postalCode?: string;
    };
    appointmentBooking: {
      onlineAppointment?: boolean;
      phone?: boolean;
      inPerson?: boolean;
    };
    serviceDays: {
      weekdays?: boolean;
      weekends?: boolean;
    };
    serviceHours: {
      workHours?: boolean;
      afterHours?: boolean;
    };
  } = {
    appointmentType: '',
    supportedTaxYears: {
      currentYear: false,
      currentLastYears: false,
      multipleYears: false,
    },
    provinces: {
      Ontario: false,
      Quebec: false,
      Other: false,
    },
    specialTaxCases: {
      selfEmployed: false,
      deceased: false,
      bankruptcy: false,
      imprisoned: false,
    },
    languageOptions: {
      french: false,
      english: false,
      arabic: false,
      other: false,
      otherLanguage: '',
    },
    serviceDeliveryModes: {
      inPerson: false,
      virtual: false,
      byAppointment: false,
      walkIn: false,
      dropOff: false,
    },
    clientCategories: {
      newcomers: false,
      students: false,
      indigenousClients: false,
      seniors: false,
      disabilities: false,
    },
    accessDocuments: {
      allDocuments: false,
      someDocuments: false,
      noDocuments: false,
    },
    catchmentArea: {
      hasCatchmentArea: false,
      postalCode: '',
    },
    appointmentBooking: {
      onlineAppointment: false,
      phone: false,
      inPerson: false,
    },
    serviceDays: {
      weekdays: false,
      weekends: false,
    },
    serviceHours: {
      workHours: false,
      afterHours: false,
    },
  };

  constructor() {}

  applyFilters() {
    this.toggleSidebarEvent.emit();
    this.filterChange.emit(this.filters);
  }

  resetFilters() {
    this.filters = {
      appointmentType: '',
      supportedTaxYears: {
        currentYear: false,
        currentLastYears: false,
        multipleYears: false,
      },
      provinces: {
        Ontario: false,
        Quebec: false,
        Other: false,
      },
      specialTaxCases: {
        selfEmployed: false,
        deceased: false,
        bankruptcy: false,
        imprisoned: false,
      },
      languageOptions: {
        french: false,
        english: false,
        arabic: false,
        other: false,
        otherLanguage: '',
      },
      serviceDeliveryModes: {
        inPerson: false,
        virtual: false,
        byAppointment: false,
        walkIn: false,
        dropOff: false,
      },
      clientCategories: {
        newcomers: false,
        students: false,
        indigenousClients: false,
        seniors: false,
        disabilities: false,
      },
      accessDocuments: {
        allDocuments: false,
        someDocuments: false,
        noDocuments: false,
      },
      catchmentArea: {
        hasCatchmentArea: false,
        postalCode: '',
      },
      appointmentBooking: {
        onlineAppointment: false,
        phone: false,
        inPerson: false,
      },
      serviceDays: {
        weekdays: false,
        weekends: false,
      },
      serviceHours: {
        workHours: false,
        afterHours: false,
      },
    };
    this.filterChange.emit();
  }

  closeFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
