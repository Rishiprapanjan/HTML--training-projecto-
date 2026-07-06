import { useEffect, useState } from 'react'
import './App.css'
import {
  evaluate,
  scientificFunctions,
  financialCalculations,
  baseConversion,
  formatNumber,
  convertUnit,
} from './calculatorUtils'

function App() {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState([])
  const [activeMode, setActiveMode] = useState('basic') // basic, scientific, financial, convert
  const [showHistory, setShowHistory] = useState(false)
  const [formattingOptions, setFormattingOptions] = useState({
    decimals: 10,
    useThousands: false,
    notation: 'standard',
  })

  // Scientific state
  const [angle, setAngle] = useState('deg') // deg or rad
  const [useHyperbollic, setUseHyperbolic] = useState(false)

  // Financial state
  const [financialInputs, setFinancialInputs] = useState({
    principal: '',
    rate: '',
    time: '',
    loanYears: '',
    type: 'simple', // simple, compound, loan, roi
  })

  // Unit conversion state
  const [unitConversion, setUnitConversion] = useState({
    value: '',
    category: 'length',
    fromUnit: 'm',
    toUnit: 'km',
  })

  const clearAll = () => setDisplay('0')
  const backspace = () => setDisplay((s) => (s.length <= 1 ? '0' : s.slice(0, -1)))

  const append = (value) => {
    if (display === '0' || display === 'Error') setDisplay(String(value))
    else setDisplay((current) => current + String(value))
  }

  const addOperator = (operator) => {
    if (display === 'Error') return
    if (/[+\-×÷*/]$/.test(display))
      setDisplay((current) => current.slice(0, -1) + operator)
    else setDisplay((current) => current + operator)
  }

  const addDecimal = () => {
    const parts = display.split(/[+\-×÷*/]/)
    const last = parts[parts.length - 1]
    if (!last.includes('.')) append('.')
  }

  const calculate = () => {
    try {
      const cleaned = display.replace(/×/g, '*').replace(/÷/g, '/')
      const result = evaluate(cleaned)
      if (!isFinite(result) || Number.isNaN(result)) {
        setDisplay('Error')
      } else {
        const formatted = formatNumber(result, formattingOptions)
        setDisplay(formatted)
        setHistory([...history, { expression: display, result: formatted }])
      }
    } catch {
      setDisplay('Error')
    }
  }

  const applyPercent = () => {
    try {
      const result = evaluate(display.replace(/×/g, '*').replace(/÷/g, '/'))
      const percent = result / 100
      setDisplay(formatNumber(percent, formattingOptions))
    } catch {
      setDisplay('Error')
    }
  }

  // Memory functions
  const memoryAdd = () => {
    try {
      const value = parseFloat(display)
      setMemory(memory + value)
    } catch {
      setDisplay('Error')
    }
  }

  const memorySubtract = () => {
    try {
      const value = parseFloat(display)
      setMemory(memory - value)
    } catch {
      setDisplay('Error')
    }
  }

  const memoryRecall = () => {
    setDisplay(memory.toString())
  }

  const memoryClear = () => {
    setMemory(0)
  }

  // Scientific functions
  const applySciFunction = (func) => {
    try {
      const value = parseFloat(display)
      let result

      if (func === 'Pi') result = scientificFunctions.Pi()
      else if (func === 'E') result = scientificFunctions.E()
      else if (func === 'factorial') result = scientificFunctions.factorial(value)
      else if (func === 'reciprocal') result = scientificFunctions.reciprocal(value)
      else if (func === 'absolute') result = scientificFunctions.absolute(value)
      else if (func === 'exp') result = scientificFunctions.exp(value)
      else if (func === 'sqrt') result = scientificFunctions.sqrt(value)
      else if (func === 'cbrt') result = scientificFunctions.cbrt(value)
      else if (func === 'log') result = scientificFunctions.log(value)
      else if (func === 'ln') result = scientificFunctions.ln(value)
      else if (func === 'sin') result = scientificFunctions.sin(value)
      else if (func === 'cos') result = scientificFunctions.cos(value)
      else if (func === 'tan') result = scientificFunctions.tan(value)
      else if (func === 'asin') result = scientificFunctions.asin(value)
      else if (func === 'acos') result = scientificFunctions.acos(value)
      else if (func === 'atan') result = scientificFunctions.atan(value)

      if (result !== undefined) {
        setDisplay(formatNumber(result, formattingOptions))
        setHistory([...history, { expression: `${func}(${value})`, result: formatNumber(result, formattingOptions) }])
      }
    } catch {
      setDisplay('Error')
    }
  }

  // Financial calculations
  const calculateFinancial = () => {
    try {
      const { type, principal, rate, time, loanYears } = financialInputs
      let result

      if (type === 'simple') {
        result = financialCalculations.simpleInterest(
          parseFloat(principal),
          parseFloat(rate),
          parseFloat(time)
        )
      } else if (type === 'compound') {
        result = financialCalculations.compoundInterest(
          parseFloat(principal),
          parseFloat(rate),
          parseFloat(time),
          1
        )
      } else if (type === 'loan') {
        result = financialCalculations.loanPayment(
          parseFloat(principal),
          parseFloat(rate),
          parseFloat(loanYears)
        )
      } else if (type === 'roi') {
        result = financialCalculations.roi(parseFloat(principal), parseFloat(rate))
      }

      setDisplay(formatNumber(result, formattingOptions))
      setHistory([...history, { expression: `${type} ${JSON.stringify(financialInputs)}`, result: formatNumber(result, formattingOptions) }])
    } catch {
      setDisplay('Error')
    }
  }

  // Unit conversion
  const handleUnitConversion = () => {
    try {
      const result = convertUnit(
        parseFloat(unitConversion.value),
        unitConversion.fromUnit,
        unitConversion.toUnit,
        unitConversion.category
      )
      setDisplay(formatNumber(result, formattingOptions))
      setHistory([
        ...history,
        {
          expression: `${unitConversion.value} ${unitConversion.fromUnit} to ${unitConversion.toUnit}`,
          result: formatNumber(result, formattingOptions),
        },
      ])
    } catch {
      setDisplay('Error')
    }
  }

  // Base conversion
  const handleBaseConversion = (toBase) => {
    try {
      const value = parseFloat(display)
      let result
      if (toBase === 'hex') result = baseConversion.toHex(value)
      else if (toBase === 'binary') result = baseConversion.toBinary(value)
      else if (toBase === 'octal') result = baseConversion.toOctal(value)
      setDisplay(result)
      setHistory([...history, { expression: `to ${toBase}(${value})`, result }])
    } catch {
      setDisplay('Error')
    }
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key
      if (/^[0-9]$/.test(key)) append(key)
      else if (key === '.') addDecimal()
      else if (key === 'Enter') calculate()
      else if (key === 'Backspace') backspace()
      else if (key === 'Escape') clearAll()
      else if (key === '+') addOperator('+')
      else if (key === '-') addOperator('-')
      else if (key === '*') addOperator('×')
      else if (key === '/') addOperator('÷')
      else if (key === '%') applyPercent()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display])

  const basicButtons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['00', '0', '.', '='],
  ]

  const scientificButtons = [
    ['C', '⌫', 'DEG/RAD', '÷'],
    ['sin', 'cos', 'tan', '×'],
    ['asin', 'acos', 'atan', '-'],
    ['log', 'ln', 'e^x', '+'],
    ['√', '∛', 'x!', '1/x'],
    ['π', 'e', '(', ')'],
    ['7', '8', '9', '←'],
    ['4', '5', '6', '.'],
    ['1', '2', '3', '='],
    ['0', '00', '+/-', 'M+'],
  ]

  const handleClick = (button) => {
    if (activeMode === 'basic') {
      if (button === 'C') clearAll()
      else if (button === '⌫') backspace()
      else if (button === '%') applyPercent()
      else if (button === '=') calculate()
      else if (['+', '-', '×', '÷'].includes(button)) addOperator(button)
      else if (button === '.') addDecimal()
      else append(button)
    } else if (activeMode === 'scientific') {
      if (button === 'C') clearAll()
      else if (button === '⌫') backspace()
      else if (button === 'DEG/RAD') setAngle(angle === 'deg' ? 'rad' : 'deg')
      else if (button === '÷') addOperator('÷')
      else if (button === '×') addOperator('×')
      else if (button === '-') addOperator('-')
      else if (button === '+') addOperator('+')
      else if (button === '.') addDecimal()
      else if (button === '=') calculate()
      else if (button === '←') backspace()
      else if (button === 'M+') memoryAdd()
      else if (button === '(') append('(')
      else if (button === ')') append(')')
      else if (button === '+/-') setDisplay((d) => (parseFloat(d) * -1).toString())
      else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', '√', '∛'].includes(button)) {
        const func = button === '√' ? 'sqrt' : button === '∛' ? 'cbrt' : button === 'e^x' ? 'exp' : button
        applySciFunction(func)
      } else if (button === 'x!') applySciFunction('factorial')
      else if (button === '1/x') applySciFunction('reciprocal')
      else if (button === 'π') append(Math.PI.toString())
      else if (button === 'e') append(Math.E.toString())
      else if (/^[0-9]$/.test(button)) append(button)
    }
  }

  return (
    <div className="calc-root">
      <div className="calc-card" role="application" aria-label="Professional calculator">
        <div className="calc-header">
          <div className="mode-buttons">
            <button
              className={`mode-btn ${activeMode === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveMode('basic')}
              title="Basic Calculator"
            >
              Basic
            </button>
            <button
              className={`mode-btn ${activeMode === 'scientific' ? 'active' : ''}`}
              onClick={() => setActiveMode('scientific')}
              title="Scientific Calculator"
            >
              Sci
            </button>
            <button
              className={`mode-btn ${activeMode === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveMode('financial')}
              title="Financial Calculator"
            >
              Fin
            </button>
            <button
              className={`mode-btn ${activeMode === 'convert' ? 'active' : ''}`}
              onClick={() => setActiveMode('convert')}
              title="Unit Converter"
            >
              Conv
            </button>
          </div>
        </div>

        <div className="calc-main">
          <div className="calc-display" aria-live="polite" aria-label="Calculator display">
            {display}
          </div>

          {activeMode === 'basic' && (
            <div className="calc-pad">
              {basicButtons.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {row.map((button) => (
                    <button
                      key={button}
                      className={
                        button === '='
                          ? 'btn-eq'
                          : ['+', '-', '×', '÷', '%'].includes(button)
                          ? 'btn-op'
                          : 'btn-num'
                      }
                      onClick={() => handleClick(button)}
                    >
                      {button}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeMode === 'scientific' && (
            <div className="calc-pad scientific-pad">
              {scientificButtons.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {row.map((button) => (
                    <button
                      key={button}
                      className={
                        button === '='
                          ? 'btn-eq'
                          : ['÷', '×', '-', '+', '='].includes(button)
                          ? 'btn-op'
                          : 'btn-num'
                      }
                      onClick={() => handleClick(button)}
                    >
                      {button}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeMode === 'financial' && (
            <div className="financial-panel">
              <div className="financial-section">
                <select
                  value={financialInputs.type}
                  onChange={(e) => setFinancialInputs({ ...financialInputs, type: e.target.value })}
                  className="financial-select"
                >
                  <option value="simple">Simple Interest</option>
                  <option value="compound">Compound Interest</option>
                  <option value="loan">Loan Payment</option>
                  <option value="roi">Return on Investment</option>
                </select>

                {financialInputs.type === 'simple' && (
                  <>
                    <input
                      type="number"
                      placeholder="Principal ($)"
                      value={financialInputs.principal}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, principal: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Rate (%)"
                      value={financialInputs.rate}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, rate: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Time (years)"
                      value={financialInputs.time}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, time: e.target.value })
                      }
                      className="financial-input"
                    />
                  </>
                )}

                {financialInputs.type === 'compound' && (
                  <>
                    <input
                      type="number"
                      placeholder="Principal ($)"
                      value={financialInputs.principal}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, principal: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Rate (%)"
                      value={financialInputs.rate}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, rate: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Time (years)"
                      value={financialInputs.time}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, time: e.target.value })
                      }
                      className="financial-input"
                    />
                  </>
                )}

                {financialInputs.type === 'loan' && (
                  <>
                    <input
                      type="number"
                      placeholder="Loan Amount ($)"
                      value={financialInputs.principal}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, principal: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Annual Rate (%)"
                      value={financialInputs.rate}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, rate: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Years"
                      value={financialInputs.loanYears}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, loanYears: e.target.value })
                      }
                      className="financial-input"
                    />
                  </>
                )}

                {financialInputs.type === 'roi' && (
                  <>
                    <input
                      type="number"
                      placeholder="Gain ($)"
                      value={financialInputs.principal}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, principal: e.target.value })
                      }
                      className="financial-input"
                    />
                    <input
                      type="number"
                      placeholder="Investment ($)"
                      value={financialInputs.rate}
                      onChange={(e) =>
                        setFinancialInputs({ ...financialInputs, rate: e.target.value })
                      }
                      className="financial-input"
                    />
                  </>
                )}

                <button onClick={calculateFinancial} className="calc-btn">
                  Calculate
                </button>
              </div>
            </div>
          )}

          {activeMode === 'convert' && (
            <div className="convert-panel">
              <select
                value={unitConversion.category}
                onChange={(e) => {
                  const newCategory = e.target.value
                  const defaultUnits = {
                    length: { from: 'm', to: 'km' },
                    weight: { from: 'kg', to: 'g' },
                    temperature: { from: 'c', to: 'f' },
                    volume: { from: 'l', to: 'ml' },
                  }
                  setUnitConversion({
                    ...unitConversion,
                    category: newCategory,
                    fromUnit: defaultUnits[newCategory].from,
                    toUnit: defaultUnits[newCategory].to,
                  })
                }}
                className="convert-select"
              >
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="volume">Volume</option>
              </select>

              <input
                type="number"
                placeholder="Enter value"
                value={unitConversion.value}
                onChange={(e) => setUnitConversion({ ...unitConversion, value: e.target.value })}
                className="convert-input"
              />

              <select
                value={unitConversion.fromUnit}
                onChange={(e) => setUnitConversion({ ...unitConversion, fromUnit: e.target.value })}
                className="convert-select"
              >
                <option value="m">Meter (m)</option>
                <option value="km">Kilometer (km)</option>
                <option value="cm">Centimeter (cm)</option>
                <option value="mm">Millimeter (mm)</option>
                <option value="inch">Inch (in)</option>
                <option value="foot">Foot (ft)</option>
                <option value="yard">Yard (yd)</option>
                <option value="mile">Mile (mi)</option>
              </select>

              <select
                value={unitConversion.toUnit}
                onChange={(e) => setUnitConversion({ ...unitConversion, toUnit: e.target.value })}
                className="convert-select"
              >
                <option value="km">Kilometer (km)</option>
                <option value="m">Meter (m)</option>
                <option value="cm">Centimeter (cm)</option>
                <option value="mm">Millimeter (mm)</option>
                <option value="inch">Inch (in)</option>
                <option value="foot">Foot (ft)</option>
                <option value="yard">Yard (yd)</option>
                <option value="mile">Mile (mi)</option>
              </select>

              <button onClick={handleUnitConversion} className="calc-btn">
                Convert
              </button>
            </div>
          )}

          <div className="calc-footer">
            <div className="memory-section">
              <span className="memory-display">M: {formatNumber(memory, formattingOptions)}</span>
              <div className="mem-buttons">
                <button onClick={memoryAdd} className="mem-btn" title="M+">M+</button>
                <button onClick={memorySubtract} className="mem-btn" title="M-">M-</button>
                <button onClick={memoryRecall} className="mem-btn" title="MR">MR</button>
                <button onClick={memoryClear} className="mem-btn" title="MC">MC</button>
              </div>
            </div>

            <button 
              className="history-toggle"
              onClick={() => setShowHistory(!showHistory)}
              title={showHistory ? 'Hide history' : 'Show history'}
            >
              {showHistory ? '▼' : '▶'} History ({history.length})
            </button>

            {showHistory && (
              <div className="history-section">
                <div className="history-list">
                  {history.length === 0 ? (
                    <div className="history-empty">No history</div>
                  ) : (
                    history.slice(-8).reverse().map((h, i) => (
                      <div key={i} className="history-item" onClick={() => setDisplay(h.result)}>
                        {h.result}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
