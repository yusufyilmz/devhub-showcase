# My Calendar

**Scope/status** · Studio has month, week and day agenda views, private Studio tasks, and an optional read-only Google Calendar and Google Tasks connection. Fitness uses the shared month, week and agenda views with its existing workout, diet and scheduling rules.

**Prerequisites** · Use the [shared setup and result rules](index.md#before-you-start), a matching local or preview build, two confirmed disposable Studio accounts, and apply [the task migration](../../../supabase/migrations/20261117090000_studio_calendar_tasks.sql) to a disposable database. Use a Google test account with a meeting, a recurring event, a multi-day event, and a dated task. Complete the Google configuration below for steps 5–7. Use the fictional Fitness [preview](https://myfitnessstudio.vercel.app/preview) for visual verification.

**Manual result** · Not run. Record the environment, commit, tester, date and safe evidence when executing the checklist.

## Google configuration

1. In [Google Cloud](https://console.cloud.google.com/apis/library), enable **Google Calendar API** and **Google Tasks API**.
2. Create an OAuth client of type **Web application**. If the consent screen is in testing, add the disposable Google account as a test user.
3. Under **Authorized redirect URIs**, add the full callback for the environment. For local Studio this is `http://localhost:3001/admin/calendar/google/callback`. For production use `https://mydevstudio.vercel.app/admin/calendar/google/callback` if that is the deployment’s canonical hostname.
4. Set `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI`, and `GOOGLE_CALENDAR_SESSION_KEY` in the Studio server environment. The session key is a random 32-byte hex value. Keep it stable across instances of the same deployment.
5. Restart or redeploy Studio. Open the same hostname registered in the callback. The connection is bound to a Studio account and browser. Google Tasks appear by due date. Google’s Tasks API returns the date only.

See [Google’s web server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server), [Calendar API scopes](https://developers.google.com/workspace/calendar/api/auth), and [Tasks API scopes](https://developers.google.com/workspace/tasks/auth).

## Checklist

| Step | Clickable URL                                            | Route path        | Action                                                                                                                                  | Expected result                                                                                                                                                                             | Actual result / evidence |
| ---- | -------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open Studio](http://localhost:3001/)                    | `/`               | Sign in and choose **My Calendar** from the profile menu.                                                                               | The calendar shows the current month and the selected day’s agenda.                                                                                                                         | Not run                  |
| 2    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Choose **Add task**, enter a title, add a date and time, and save. Reload, choose **Edit task**, and mark it completed.                 | The task survives reload and shows its saved time and completed status.                                                                                                                     | Not run                  |
| 3    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Create a second task, switch to **Week**, and drag the task to a different date and hour. Edit it and use **Delete task**.              | The task moves to the chosen slot and disappears after deletion.                                                                                                                            | Not run                  |
| 4    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Open one task in two tabs, save from one tab, then save the older version. Open the calendar as a second Studio user and signed out.    | The older save reports a conflict. The second account sees only its own tasks. Signed-out visitors go to sign-in.                                                                           | Not run                  |
| 5    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Choose **Connect Google Calendar**, grant access, and switch between **Google Calendar** and **Google Tasks** in the **Show** selector. | Events and dated tasks appear in their views. Meetings follow the browser time zone, multi-day events appear on each day, and Google entries link out when Google provides a supported URL. | Not run                  |
| 6    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Decline the Google consent prompt, retry the connection, and choose **Disconnect Google**.                                              | Declining gives a retry message. Disconnecting removes Google entries while retaining Studio tasks.                                                                                         | Not run                  |
| 7    | [Open My Calendar](http://localhost:3001/admin/calendar) | `/admin/calendar` | Revoke access in the test Google Account, then choose **Refresh calendar**.                                                             | Studio reports the expired connection and offers **Reconnect Google**. Studio tasks remain available.                                                                                       | Not run                  |
| 8    | [Open Fitness preview](http://localhost:3002/preview)    | `/preview`        | Open **Calendar**, switch between **Month** and **Week**, and open a date or an activity. Test at desktop and phone widths.             | The views remain usable at both widths and the existing Fitness agenda and activity details open.                                                                                           | Not run                  |

## Automated evidence

- [Studio calendar browser workflow](../../../apps/my-dev-studio/e2e/calendar/my-calendar.spec.ts)
- [Fitness calendar browser workflow](../../../apps/my-fitness-app/e2e/calendar/calendar.spec.ts)
- [Studio task ownership](../../../packages/lib/src/db/rls/studio-calendar-tasks.test.ts)
- [Google provider fixtures](../../../packages/calendar/src/google.test.ts)
