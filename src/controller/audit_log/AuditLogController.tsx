import AuditLogDao from "src/firebase/firestore/audit_log/AuditLogDao";

class AuditLogController {
    public static addLog(action: string) {
        AuditLogDao.addLog(action);
    }
}

export default AuditLogController;