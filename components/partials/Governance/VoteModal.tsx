import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { CheckCircle, XCircle } from "lucide-react";

interface VoteModalProps {
  show: boolean;
  voteType: "agree" | "against" | null;
  comment: string;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  show,
  voteType,
  comment,
  onCommentChange,
  onSubmit,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard
        theme="dark"
        variant="default"
        className="p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Vote {voteType === "agree" ? "Agree" : "Against"}
        </h3>
        <p className="text-gray-300 mb-4">
          Please provide a reason for your vote. This will be publicly visible
          to other participants.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Comment/Reason
          </label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Explain why you are voting this way..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-400">{comment.length}/500</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <ActionButton
            variant="secondary"
            size="md"
            theme="dark"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="primary"
            size="md"
            theme="dark"
            onClick={onSubmit}
            className={`flex-1 ${
              voteType === "agree"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {voteType === "agree" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Agree
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Submit Against
              </>
            )}
          </ActionButton>
        </div>
      </GlassCard>
    </div>
  );
};
