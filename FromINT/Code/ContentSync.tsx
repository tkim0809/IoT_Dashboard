import { useEffect, useState } from "react";
import { Dashboard } from "./Dashboard";

const url = "/admin-ui/sync_content.log";

type Status = "queued" | "inprogress" |  "finished"  | "failed";

export interface TransferState {
  status: Status;
  from?: number;
  to?: number;
  transferred?: number,
  transfer_ms?: number,
}

export type Transfer = [string, TransferState];

let lastRawTransfer = "";

export const ContentSync = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [lastUpdate, setLastUpdate] = useState<undefined | Date>();
    useEffect(() => {
        let timer: number | undefined = undefined;
        const update = async () => {
            try {
                const rawTransferReceived = await fetch(url, { headers: {'Cache-Control': 'no-cache'}}).then(resp => resp.text());
                // change detection using text
                console.debug(rawTransferReceived);
                if (rawTransferReceived != lastRawTransfer || lastRawTransfer == '') {
                    lastRawTransfer = rawTransferReceived;
                    setTransfers(JSON.parse(rawTransferReceived));
                    setLastUpdate(new Date());
                }
            } catch (e) {
                console.error("Failed to fetch status: ", e);
            }
            timer = window.setTimeout(update, 1000);
        };
        update();
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={'admin sync-dashboard'}>
            <Dashboard transfers={transfers}></Dashboard>
        </div>
    );
};