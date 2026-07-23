import { UIIntention, SelfAwarenessContext } from './types';
import { toast } from '@/components/ui/toast';

export class UIIntentionEngine {
  private historyStack: UIIntention[] = [];
  private undoStack: UIIntention[] = [];

  public executeIntention(intention: UIIntention, context: SelfAwarenessContext): boolean {
    // 1. RBAC Security Check
    if (context.userRole !== 'admin' && context.userRole !== 'superadmin') {
      if (intention.type === 'removeWidget' || intention.type === 'saveDashboard') {
        toast(`Permission Denied: ${context.userRole} cannot perform ${intention.type}`, { type: 'info' });
        return false;
      }
    }

    // 2. Push to Audit History Stack
    this.historyStack.push(intention);
    this.undoStack = []; // Reset redo stack on new action

    // 3. Dispatch Notification
    toast(`⚡ Autopilot: ${intention.description}`, { type: 'success' });
    return true;
  }

  public getHistory(): UIIntention[] {
    return this.historyStack;
  }

  public undoLastAction(): UIIntention | null {
    const last = this.historyStack.pop();
    if (last) {
      this.undoStack.push(last);
      toast(`Undid action: ${last.description}`, { type: 'info' });
      return last;
    }
    return null;
  }
}

export const intentionEngine = new UIIntentionEngine();
