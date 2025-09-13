import {
    format,
    formatDistanceToNow as dateFnsFormatDistanceToNow,
} from "date-fns";
import { enUS, pt, ptBR } from "date-fns/locale";

export function formatDateTime(rawDate: string): string {
    const date = new Date(rawDate);

    return format(date, "dd/MM/yyyy 'at' HH'h'mm", {
        locale: ptBR,
    });
}

export function formatDistanceToNow(rawDate: string): string {
    const date = new Date(rawDate);

    return dateFnsFormatDistanceToNow(date, {
        locale: enUS,
        addSuffix: true,
    });
}

export function formatHour(timestampMs: number): string {
    const date = new Date(timestampMs);

    return format(date, "HH:mm:ss", {
        locale: ptBR,
    });
}
