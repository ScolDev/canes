import { BenchmarkFactory } from './instructions/benchmark-factory'
import { benchMark } from './instructions/instructions'

const benchmarkType = process.argv[2]
const benchmarkFactory = new BenchmarkFactory()
const benchmarkConfig = benchmarkFactory.create(benchmarkType)

benchMark(benchmarkConfig)
