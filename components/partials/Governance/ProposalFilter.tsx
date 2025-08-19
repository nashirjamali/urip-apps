import type React from "react";
import { Filter } from "lucide-react";

interface ProposalFilterProps {
  statusFilter: "All" | "Active" | "Executed" | "Pending" | "Cancelled";
  onFilterChange: (
    filter: "All" | "Active" | "Executed" | "Pending" | "Cancelled"
  ) => void;
}

export const ProposalFilter: React.FC<ProposalFilterProps> = ({
  statusFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-white">Proposals</h2>
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) =>
            onFilterChange(
              e.target.value as
                | "All"
                | "Active"
                | "Executed"
                | "Pending"
                | "Cancelled"
            )
          }
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50"
        >
          <option value="All" className="bg-gray-800 text-white">
            All Status
          </option>
          <option value="Active" className="bg-gray-800 text-white">
            Active
          </option>
          <option value="Executed" className="bg-gray-800 text-white">
            Executed
          </option>
          <option value="Pending" className="bg-gray-800 text-white">
            Pending
          </option>
          <option value="Cancelled" className="bg-gray-800 text-white">
            Cancelled
          </option>
        </select>
      </div>
    </div>
  );
};
