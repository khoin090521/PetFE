import { Injectable } from '@angular/core';
import {
    CalendarSchedulerEvent,
    CalendarSchedulerEventStatus,
    CalendarSchedulerEventAction
} from 'angular-calendar-scheduler';
import {
    addDays,
    startOfHour,
    addHours,
    subHours,
    setHours,
    subMinutes,
    addMinutes
} from 'date-fns';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { Observable, catchError } from 'rxjs';


@Injectable()
export class AppService {

    constructor(
        private http: HttpClient,
    ){}

    // async getDoctorByClinic(){
    //     const customerId = localStorage.getItem("user_id");
    //     return await this.http.get<any>(`${BASE_URL}/booking/listbycustomer?customer-id=${customerId}`).toPromise();
    // }

    // async getDoctorByClinic(){
    //     const customerId = localStorage.getItem("user_id");
    //     const response = await this.http.get<any>(`${BASE_URL}/booking/listbycustomer?customer-id=${customerId}`).toPromise();
    //     return response.data;
    // }

    async getEvents(actions: CalendarSchedulerEventAction[]): Promise<CalendarSchedulerEvent[]> {
        // const events = [
        //     <CalendarSchedulerEvent>{
        //         // id: '7',
        //         // start: addDays(startOfHour(setHours(new Date(), 14)), 4),
        //         // end: addDays(addDays(startOfHour(setHours(new Date(), 14)), 4), 2),
        //         // title: 'Event 7',
        //         // content: 'THREE DAYS EVENT',
        //         // color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
        //         // actions: actions,
        //         // status: 'ok' as CalendarSchedulerEventStatus,
        //         // isClickable: true,
        //         // isDisabled: false
        //     },
        // ];

        const customerId = localStorage.getItem("user_id");
        const routerUrl = window.location.href
        const urlObj = new URL(routerUrl);

        const clinicId = Number(urlObj.searchParams.get('clinicId') || '');



        const response = await this.http.get<any>(`${BASE_URL}/booking/listbycustomer?customer-id=${customerId}&clinic-id=${clinicId}`).toPromise();
        const data = response.data;

        const events = data.map((item: any) => {

            const targetStartDate = new Date(item.start);
            const targetEndDate = new Date(item.end);

            const today = new Date();

            const daysDiff = Math.floor((targetStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));


            const startHour = targetStartDate.getHours(); // 12
            const startMinutes = targetStartDate.getMinutes(); // 30
            const startDecimal = startHour + startMinutes / 60;

            const endHour = targetEndDate.getHours(); // 12
            const endMinutes = targetEndDate.getMinutes(); // 30
            const endDecimal = endHour + endMinutes / 60;

            const start = addDays(startOfHour(setHours(new Date(), startDecimal)), daysDiff);
            const end = addDays(startOfHour(setHours(new Date(), endDecimal)), daysDiff);

            const statusBooking = item.status === 1 ?"Đã chấp nhận" : item.status === 0 ? "Đang chờ bác sĩ" : "Đã từ chối";
            return <CalendarSchedulerEvent>{
                id: item.id,
                start: targetStartDate,
                end: targetEndDate,
                title: item.content,
                content: statusBooking,
                actions: actions,
                status: item.status === 1 ? 'ok' as CalendarSchedulerEventStatus : 'cancelled' as CalendarSchedulerEventStatus, // Example status mapping
                isClickable: true,
                isDisabled: false
            };
        });


        return new Promise(resolve => setTimeout(() => resolve(events), 3000));
    }
}
