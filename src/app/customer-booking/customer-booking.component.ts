import { Component, OnInit, Inject, LOCALE_ID, HostListener, TemplateRef, ChangeDetectorRef, AfterViewChecked, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { endOfDay, addMonths } from 'date-fns';
import {
    DAYS_IN_WEEK,
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    CalendarSchedulerEvent,
    CalendarSchedulerEventAction,
    startOfPeriod,
    endOfPeriod,
    addPeriod,
    subPeriod,
    SchedulerDateFormatter,
    SchedulerEventTimesChangedEvent
} from 'angular-calendar-scheduler';
import {
    CalendarView,
    CalendarDateFormatter,
    DateAdapter
} from 'angular-calendar';
import {
    addDays,
    startOfHour,
    addHours,
    subHours,
    setHours,
    subMinutes,
    addMinutes
} from 'date-fns';
import { AppService } from '../service/app.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { ToastrService } from 'ngx-toastr';


interface SearchResult {
    id: number,
    name: string,
    quantity: number,
    price: 12000,
    type: string,
    trademark: string,
    descrition: string,
    clinicId: number,
    medicine_image: []
}

@Component({
  selector: 'app-customer-booking',
  templateUrl: './customer-booking.component.html',
  styleUrls: ['./customer-booking.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})

export class CustomerBookingComponent implements OnInit, AfterViewChecked{

    CalendarView = CalendarView;
    modalRef?: BsModalRef;
    dateModel: Date = new Date();
    maxWidth: number = 42;
    bookingDate: any = "";

    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();
    viewDays: number = DAYS_IN_WEEK;
    refresh: Subject<any> = new Subject();
    locale: string = 'en';
    hourSegments: 1 | 2 | 4 | 6 = 2; // Assign a default allowed value
    weekStartsOn: number = 1;
    startsWithToday: boolean = true;
    activeDayIsOpen: boolean = true;
    excludeDays: number[] = []; // [0];
    dayStartHour: number = 9;
    dayEndHour: number = 20;

    minDate: Date = new Date();
    maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function = () => {};
    hourModifier: Function = () => {};
    segmentModifier: Function;
    eventModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;
    calendar: boolean = true;
    medicineDescription?: string;

    searchResults?: SearchResult[] | null;
    listMedicine?: any;

    actions: CalendarSchedulerEventAction[] = [
        {
            when: 'enabled',
            label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
            title: 'Delete',
            onClick: (event: CalendarSchedulerEvent): void => {
                console.log('Pressed action \'Delete\' on event ' + event.id);
            }
        },
        {
            when: 'cancelled',
            label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
            title: 'Restore',
            onClick: (event: CalendarSchedulerEvent): void => {
                console.log('Pressed action \'Restore\' on event ' + event.id);
            }
        }
    ];

    events: CalendarSchedulerEvent[] = [];

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.adjustViewDays();
    }

    constructor(
        @Inject(LOCALE_ID) locale: string, 
        private cdr: ChangeDetectorRef,
        private appService: AppService, 
        private dateAdapter: DateAdapter, 
        private modalService: BsModalService,
        private http: HttpClient,
        private toastService: ToastrService,
        private zone: NgZone) {

        this.locale = locale;

        this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
            segment.isDisabled = !this.isDateValid(segment.date);
        }).bind(this);

        this.eventModifier = ((event: CalendarSchedulerEvent): void => {
            event.isDisabled = !this.isDateValid(event.start);
        }).bind(this);

        this.adjustViewDays();
        this.dateOrViewChanged();
    }

    ngOnInit(): void {
        this.appService.getEvents(this.actions).then((events: CalendarSchedulerEvent[]) => this.events = events);
        this.getMedicalByClinic();
    }

    async getMedicalByClinic() {
        this.http.get<any>(`${BASE_URL}/medicine/list?clinic-id=1`).subscribe(
            (res) => {
                this.listMedicine = res.data;
            },
            (err) => {}
        );
    }

    viewDetail(descrition: string,template: TemplateRef<any>){
        this.medicineDescription = descrition;
        this.modalRef = this.modalService.show(template);
    }

    ngAfterViewChecked() {
    }

    adjustViewDays(): void {
        const currentWidth: number = window.innerWidth;
        if (currentWidth <= 450) {
            this.viewDays = 1;
        } else if (currentWidth <= 768) {
            this.viewDays = 3;
        } else {
            this.viewDays = DAYS_IN_WEEK;
        }
    }

    changeDate(date: Date): void {
        console.log('changeDate', date);
        this.viewDate = date;
        this.dateOrViewChanged();
    }

    changeView(view: CalendarView): void {
        console.log('changeView', view);
        this.view = view;
        this.dateOrViewChanged();
    }

    dateOrViewChanged(): void {
        // if (this.startsWithToday) {
        //     this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
        //     this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
        // } else {
        //     this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
        //     this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
        // }

        // if (this.viewDate < this.minDate) {
        //     this.changeDate(this.minDate);
        // } else if (this.viewDate > this.maxDate) {
        //     this.changeDate(this.maxDate);
        // }
    }

    private isDateValid(date: Date): boolean {
        return date >= this.minDate && date <= this.maxDate;
    }

    dayHeaderClicked(day: SchedulerViewDay): void {
        console.log('dayHeaderClicked Day', day);
    }

    hourClicked(hour: SchedulerViewHour): void {
        console.log('hourClicked Hour', hour);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    segmentClicked(action: string, segment: SchedulerViewHourSegment, template: TemplateRef<any>): void {
        console.log('segmentClicked Action', action);
        console.log('segmentClicked Segment', segment.date);


        // const date = new Date(segment.date);

        // // Extract the individual components
        // const year = date.getUTCFullYear();
        // const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        // const day = String(date.getUTCDate()).padStart(2, '0');
        // const hours = String(date.getUTCHours()).padStart(2, '0');
        // const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        // // Format the date-time string
        const formattedString = this.formatDate(segment.date.toString());
        this.bookingDate = formattedString;

        console.log("formattedString",formattedString);

        this.modalRef = this.modalService.show(template);
    }

    eventClicked(action: string, event: CalendarSchedulerEvent): void {
        console.log('eventClicked Action', action);
        console.log('eventClicked Event', event);
    }

    eventTimesChanged({ event, newStart, newEnd, type }: SchedulerEventTimesChangedEvent): void {
        console.log('eventTimesChanged Type', type);
        console.log('eventTimesChanged Event', event);
        console.log('eventTimesChanged New Times', newStart, newEnd);
        const ev = this.events.find(e => e.id === event.id);
        if (!ev) {
        throw new Error(`Event with id ${event.id} not found`);
        }
        ev.start = newStart;
        ev.end = newEnd;
        this.refresh.next(true);
    }

    closeForm() {
        this.modalRef?.hide();
    }

    openCalendar(){
        this.calendar = true;
    }

    openMedical(){
        this.calendar = false;
    }
  
}
