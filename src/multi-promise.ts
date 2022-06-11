function multiPromise<DataTasks extends unknown[], ResultTask = unknown>(
  dataForTasks: DataTasks,
  createTask: <Index extends number>(
    data: DataTasks[Index],
    index: Index
  ) => Promise<ResultTask>,
  concurrent: number,
  onTaskDone: (resultTask: ResultTask, index: number) => Promise<ResultTask>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskError: (error: any, index: number) => Promise<ResultTask>,
  skipError: true
): Promise<(ResultTask | null)[]>
// eslint-disable-next-line no-redeclare
function multiPromise<DataTasks extends unknown[], ResultTask = unknown>(
  dataForTasks: DataTasks,
  createTask: <Index extends number>(
    data: DataTasks[Index],
    index: Index
  ) => Promise<ResultTask>,
  concurrent: number,
  onTaskDone?: (resultTask: ResultTask, index: number) => Promise<ResultTask>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskError?: (error: any, index: number) => Promise<ResultTask>,
  skipError?: false
): Promise<ResultTask[]>

// eslint-disable-next-line no-redeclare
function multiPromise<DataTasks extends unknown[], ResultTask = unknown>(
  dataForTasks: DataTasks,
  createTask: <Index extends number>(
    data: DataTasks[Index],
    index: Index
  ) => Promise<ResultTask>,
  concurrent = 5,
  onTaskDone?: (resultTask: ResultTask, index: number) => Promise<ResultTask>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskError?: (error: any, index: number) => Promise<ResultTask>,
  skipError?: boolean
) {
  const tasks = new Set()

  const results: (ResultTask | null)[] = []

  // eslint-disable-next-line functional/no-let
  let indexLastTaskCreated = 0
  // eslint-disable-next-line functional/no-let
  let tasksDone = 0
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  return new Promise<(ResultTask | null)[]>((resolve, reject) => {
    const createTasks = () => {
      // eslint-disable-next-line functional/no-let
      for (let i = 0, { size } = tasks; i < concurrent - size; i++) {
        const indexCurrent = indexLastTaskCreated++

        if (indexCurrent > dataForTasks.length - 1) break
        const task = createTask(dataForTasks[indexCurrent], indexCurrent)
          .then((result) => {
            results.push(result)
            onTaskDone?.(result, indexCurrent)
            tasks.delete(task)

            tasksDone++

            createTasks()

            return result
          })
          .catch(async (err) => {
            try {
              // eslint-disable-next-line functional/no-throw-statement
              if (!onTaskError) throw err
              results.push(await onTaskError(err, indexCurrent))
              resolve(results)
            } catch (err) {
              if (skipError) {
                results.push(null)
                tasks.delete(task)
                tasksDone++
                createTasks()
              } else {
                reject(err)
                // eslint-disable-next-line functional/no-throw-statement
                throw err
              }
            }
          })
          .then(() => {
            // eslint-disable-next-line promise/always-return
            if (/* isDone */ tasksDone === dataForTasks.length) {
              resolve(results)
              tasks.clear()
            }
          })
        tasks.add(task)
      }
    }
    createTasks()
  })
}

export default multiPromise
