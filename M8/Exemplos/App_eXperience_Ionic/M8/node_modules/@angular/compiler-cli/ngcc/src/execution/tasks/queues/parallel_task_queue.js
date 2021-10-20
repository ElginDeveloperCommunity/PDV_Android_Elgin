(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/execution/tasks/queues/parallel_task_queue", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/execution/tasks/utils", "@angular/compiler-cli/ngcc/src/execution/tasks/queues/base_task_queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParallelTaskQueue = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/utils");
    var base_task_queue_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/queues/base_task_queue");
    /**
     * A `TaskQueue` implementation that assumes tasks are processed in parallel, thus has to ensure a
     * task's dependencies have been processed before processing the task.
     */
    var ParallelTaskQueue = /** @class */ (function (_super) {
        tslib_1.__extends(ParallelTaskQueue, _super);
        function ParallelTaskQueue(logger, tasks, dependencies) {
            var _this = _super.call(this, logger, utils_1.sortTasksByPriority(tasks, dependencies), dependencies) || this;
            _this.blockedTasks = utils_1.getBlockedTasks(dependencies);
            return _this;
        }
        ParallelTaskQueue.prototype.computeNextTask = function () {
            var _this = this;
            // Look for the first available (i.e. not blocked) task.
            // (NOTE: Since tasks are sorted by priority, the first available one is the best choice.)
            var nextTaskIdx = this.tasks.findIndex(function (task) { return !_this.blockedTasks.has(task); });
            if (nextTaskIdx === -1)
                return null;
            // Remove the task from the list of available tasks and add it to the list of in-progress tasks.
            var nextTask = this.tasks[nextTaskIdx];
            this.tasks.splice(nextTaskIdx, 1);
            this.inProgressTasks.add(nextTask);
            return nextTask;
        };
        ParallelTaskQueue.prototype.markAsCompleted = function (task) {
            var e_1, _a;
            _super.prototype.markAsCompleted.call(this, task);
            if (!this.dependencies.has(task)) {
                return;
            }
            try {
                // Unblock the tasks that are dependent upon `task`
                for (var _b = tslib_1.__values(this.dependencies.get(task)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var dependentTask = _c.value;
                    if (this.blockedTasks.has(dependentTask)) {
                        var blockingTasks = this.blockedTasks.get(dependentTask);
                        // Remove the completed task from the lists of tasks blocking other tasks.
                        blockingTasks.delete(task);
                        if (blockingTasks.size === 0) {
                            // If the dependent task is not blocked any more, mark it for unblocking.
                            this.blockedTasks.delete(dependentTask);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        ParallelTaskQueue.prototype.toString = function () {
            return _super.prototype.toString.call(this) + "\n" +
                ("  Blocked tasks (" + this.blockedTasks.size + "): " + this.stringifyBlockedTasks('    '));
        };
        ParallelTaskQueue.prototype.stringifyBlockedTasks = function (indentation) {
            var _this = this;
            return Array.from(this.blockedTasks)
                .map(function (_a) {
                var _b = tslib_1.__read(_a, 2), task = _b[0], blockingTasks = _b[1];
                return "\n" + indentation + "- " + utils_1.stringifyTask(task) + " (" + blockingTasks.size + "): " +
                    _this.stringifyTasks(Array.from(blockingTasks), indentation + "    ");
            })
                .join('');
        };
        return ParallelTaskQueue;
    }(base_task_queue_1.BaseTaskQueue));
    exports.ParallelTaskQueue = ParallelTaskQueue;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWxsZWxfdGFza19xdWV1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9leGVjdXRpb24vdGFza3MvcXVldWVzL3BhcmFsbGVsX3Rhc2tfcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLDhFQUE2RTtJQUM3RSx5R0FBZ0Q7SUFFaEQ7OztPQUdHO0lBQ0g7UUFBdUMsNkNBQWE7UUFRbEQsMkJBQVksTUFBYyxFQUFFLEtBQTRCLEVBQUUsWUFBOEI7WUFBeEYsWUFDRSxrQkFBTSxNQUFNLEVBQUUsMkJBQW1CLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxFQUFFLFlBQVksQ0FBQyxTQUV0RTtZQURDLEtBQUksQ0FBQyxZQUFZLEdBQUcsdUJBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7UUFDcEQsQ0FBQztRQUVRLDJDQUFlLEdBQXhCO1lBQUEsaUJBWUM7WUFYQyx3REFBd0Q7WUFDeEQsMEZBQTBGO1lBQzFGLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1lBQy9FLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUVwQyxnR0FBZ0c7WUFDaEcsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbkMsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUVRLDJDQUFlLEdBQXhCLFVBQXlCLElBQVU7O1lBQ2pDLGlCQUFNLGVBQWUsWUFBQyxJQUFJLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU87YUFDUjs7Z0JBRUQsbURBQW1EO2dCQUNuRCxLQUE0QixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXJELElBQU0sYUFBYSxXQUFBO29CQUN0QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUN4QyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUUsQ0FBQzt3QkFDNUQsMEVBQTBFO3dCQUMxRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMzQixJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFOzRCQUM1Qix5RUFBeUU7NEJBQ3pFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3lCQUN6QztxQkFDRjtpQkFDRjs7Ozs7Ozs7O1FBQ0gsQ0FBQztRQUVRLG9DQUFRLEdBQWpCO1lBQ0UsT0FBVSxpQkFBTSxRQUFRLFdBQUUsT0FBSTtpQkFDMUIsc0JBQW9CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxXQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUcsQ0FBQSxDQUFDO1FBQzNGLENBQUM7UUFFTyxpREFBcUIsR0FBN0IsVUFBOEIsV0FBbUI7WUFBakQsaUJBT0M7WUFOQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDL0IsR0FBRyxDQUNBLFVBQUMsRUFBcUI7b0JBQXJCLEtBQUEscUJBQXFCLEVBQXBCLElBQUksUUFBQSxFQUFFLGFBQWEsUUFBQTtnQkFDakIsT0FBQSxPQUFLLFdBQVcsVUFBSyxxQkFBYSxDQUFDLElBQUksQ0FBQyxVQUFLLGFBQWEsQ0FBQyxJQUFJLFFBQUs7b0JBQ3BFLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBSyxXQUFXLFNBQU0sQ0FBQztZQURwRSxDQUNvRSxDQUFDO2lCQUM1RSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQTdERCxDQUF1QywrQkFBYSxHQTZEbkQ7SUE3RFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc3JjL25ndHNjL2xvZ2dpbmcnO1xuaW1wb3J0IHtQYXJ0aWFsbHlPcmRlcmVkVGFza3MsIFRhc2ssIFRhc2tEZXBlbmRlbmNpZXN9IGZyb20gJy4uL2FwaSc7XG5pbXBvcnQge2dldEJsb2NrZWRUYXNrcywgc29ydFRhc2tzQnlQcmlvcml0eSwgc3RyaW5naWZ5VGFza30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtCYXNlVGFza1F1ZXVlfSBmcm9tICcuL2Jhc2VfdGFza19xdWV1ZSc7XG5cbi8qKlxuICogQSBgVGFza1F1ZXVlYCBpbXBsZW1lbnRhdGlvbiB0aGF0IGFzc3VtZXMgdGFza3MgYXJlIHByb2Nlc3NlZCBpbiBwYXJhbGxlbCwgdGh1cyBoYXMgdG8gZW5zdXJlIGFcbiAqIHRhc2sncyBkZXBlbmRlbmNpZXMgaGF2ZSBiZWVuIHByb2Nlc3NlZCBiZWZvcmUgcHJvY2Vzc2luZyB0aGUgdGFzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhcmFsbGVsVGFza1F1ZXVlIGV4dGVuZHMgQmFzZVRhc2tRdWV1ZSB7XG4gIC8qKlxuICAgKiBBIG1hcCBmcm9tIFRhc2tzIHRvIHRoZSBUYXNrcyB0aGF0IGl0IGRlcGVuZHMgdXBvbi5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgcmV2ZXJzZSBtYXBwaW5nIG9mIGBUYXNrRGVwZW5kZW5jaWVzYC5cbiAgICovXG4gIHByaXZhdGUgYmxvY2tlZFRhc2tzOiBNYXA8VGFzaywgU2V0PFRhc2s+PjtcblxuICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlciwgdGFza3M6IFBhcnRpYWxseU9yZGVyZWRUYXNrcywgZGVwZW5kZW5jaWVzOiBUYXNrRGVwZW5kZW5jaWVzKSB7XG4gICAgc3VwZXIobG9nZ2VyLCBzb3J0VGFza3NCeVByaW9yaXR5KHRhc2tzLCBkZXBlbmRlbmNpZXMpLCBkZXBlbmRlbmNpZXMpO1xuICAgIHRoaXMuYmxvY2tlZFRhc2tzID0gZ2V0QmxvY2tlZFRhc2tzKGRlcGVuZGVuY2llcyk7XG4gIH1cblxuICBvdmVycmlkZSBjb21wdXRlTmV4dFRhc2soKTogVGFza3xudWxsIHtcbiAgICAvLyBMb29rIGZvciB0aGUgZmlyc3QgYXZhaWxhYmxlIChpLmUuIG5vdCBibG9ja2VkKSB0YXNrLlxuICAgIC8vIChOT1RFOiBTaW5jZSB0YXNrcyBhcmUgc29ydGVkIGJ5IHByaW9yaXR5LCB0aGUgZmlyc3QgYXZhaWxhYmxlIG9uZSBpcyB0aGUgYmVzdCBjaG9pY2UuKVxuICAgIGNvbnN0IG5leHRUYXNrSWR4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgodGFzayA9PiAhdGhpcy5ibG9ja2VkVGFza3MuaGFzKHRhc2spKTtcbiAgICBpZiAobmV4dFRhc2tJZHggPT09IC0xKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFJlbW92ZSB0aGUgdGFzayBmcm9tIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSB0YXNrcyBhbmQgYWRkIGl0IHRvIHRoZSBsaXN0IG9mIGluLXByb2dyZXNzIHRhc2tzLlxuICAgIGNvbnN0IG5leHRUYXNrID0gdGhpcy50YXNrc1tuZXh0VGFza0lkeF07XG4gICAgdGhpcy50YXNrcy5zcGxpY2UobmV4dFRhc2tJZHgsIDEpO1xuICAgIHRoaXMuaW5Qcm9ncmVzc1Rhc2tzLmFkZChuZXh0VGFzayk7XG5cbiAgICByZXR1cm4gbmV4dFRhc2s7XG4gIH1cblxuICBvdmVycmlkZSBtYXJrQXNDb21wbGV0ZWQodGFzazogVGFzayk6IHZvaWQge1xuICAgIHN1cGVyLm1hcmtBc0NvbXBsZXRlZCh0YXNrKTtcblxuICAgIGlmICghdGhpcy5kZXBlbmRlbmNpZXMuaGFzKHRhc2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVW5ibG9jayB0aGUgdGFza3MgdGhhdCBhcmUgZGVwZW5kZW50IHVwb24gYHRhc2tgXG4gICAgZm9yIChjb25zdCBkZXBlbmRlbnRUYXNrIG9mIHRoaXMuZGVwZW5kZW5jaWVzLmdldCh0YXNrKSEpIHtcbiAgICAgIGlmICh0aGlzLmJsb2NrZWRUYXNrcy5oYXMoZGVwZW5kZW50VGFzaykpIHtcbiAgICAgICAgY29uc3QgYmxvY2tpbmdUYXNrcyA9IHRoaXMuYmxvY2tlZFRhc2tzLmdldChkZXBlbmRlbnRUYXNrKSE7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgY29tcGxldGVkIHRhc2sgZnJvbSB0aGUgbGlzdHMgb2YgdGFza3MgYmxvY2tpbmcgb3RoZXIgdGFza3MuXG4gICAgICAgIGJsb2NraW5nVGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICBpZiAoYmxvY2tpbmdUYXNrcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlcGVuZGVudCB0YXNrIGlzIG5vdCBibG9ja2VkIGFueSBtb3JlLCBtYXJrIGl0IGZvciB1bmJsb2NraW5nLlxuICAgICAgICAgIHRoaXMuYmxvY2tlZFRhc2tzLmRlbGV0ZShkZXBlbmRlbnRUYXNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3N1cGVyLnRvU3RyaW5nKCl9XFxuYCArXG4gICAgICAgIGAgIEJsb2NrZWQgdGFza3MgKCR7dGhpcy5ibG9ja2VkVGFza3Muc2l6ZX0pOiAke3RoaXMuc3RyaW5naWZ5QmxvY2tlZFRhc2tzKCcgICAgJyl9YDtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5naWZ5QmxvY2tlZFRhc2tzKGluZGVudGF0aW9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuYmxvY2tlZFRhc2tzKVxuICAgICAgICAubWFwKFxuICAgICAgICAgICAgKFt0YXNrLCBibG9ja2luZ1Rhc2tzXSkgPT5cbiAgICAgICAgICAgICAgICBgXFxuJHtpbmRlbnRhdGlvbn0tICR7c3RyaW5naWZ5VGFzayh0YXNrKX0gKCR7YmxvY2tpbmdUYXNrcy5zaXplfSk6IGAgK1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyaW5naWZ5VGFza3MoQXJyYXkuZnJvbShibG9ja2luZ1Rhc2tzKSwgYCR7aW5kZW50YXRpb259ICAgIGApKVxuICAgICAgICAuam9pbignJyk7XG4gIH1cbn1cbiJdfQ==