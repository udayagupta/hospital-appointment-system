import React, { useState } from 'react';
import PopUpModal from '../PopUpModal/PopUpModal';
import { generateSlotsForDateRange } from '../../utils/helpers';

const GenerateSlotsModal = ({ isOpen, onClose, doctorId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(30);
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!startDate || !endDate) return setError("Please select a date range");
    if (new Date(startDate) > new Date(endDate)) return setError("Start date cannot be after end date");
    if (startTime >= endTime) return setError("Start time cannot be after end time");

    setError(null);
    setIsLoading(true);

    try {
      const slots = generateSlotsForDateRange(startDate, endDate, startTime, endTime, duration, breakStart, breakEnd);

      const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/slots`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slots })
      });

      if (!response.ok) {
        const data = await response.json();
        return setError(data.message);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error generating slots:", error);
      setError("Server error, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-800 text-slate-100";
  const labelClass = "mb-2 text-sm font-semibold text-slate-300";

  return (
    <PopUpModal isOpen={isOpen} onClose={onClose} title="Generate Available Slots">
      <div className="space-y-4">

        {/* DATE RANGE */}
        <div className="flex gap-3">
          <div className="flex flex-col flex-1">
            <label className={labelClass}>From</label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className={labelClass}>To</label>
            <input
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* WORKING HOURS */}
        <div className="flex gap-3">
          <div className="flex flex-col flex-1">
            <label className={labelClass}>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className={labelClass}>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* DURATION */}
        <div className="flex flex-col">
          <label className={labelClass}>Slot Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={inputClass}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        {/* BREAK TIME */}
        <div>
          <p className={labelClass}>Break Time</p>
          <div className="flex gap-3">
            <div className="flex flex-col flex-1">
              <label className="mb-2 text-xs text-slate-400">From</label>
              <input
                type="time"
                value={breakStart}
                onChange={(e) => setBreakStart(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-2 text-xs text-slate-400">To</label>
              <input
                type="time"
                value={breakEnd}
                onChange={(e) => setBreakEnd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div role="status" className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm text-center font-medium">
            Slots generated successfully!
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white mt-2 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Slots"}
        </button>

      </div>
    </PopUpModal>
  );
};

export default GenerateSlotsModal;