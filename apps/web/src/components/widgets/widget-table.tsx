import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WidgetTableProps {
  title: string
  columns: string[]
  rows: Array<Array<string | { value: string; badge?: string; color?: string }>>
}

export function WidgetTable({ title, columns, rows }: WidgetTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {columns.map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                {row.map((cell, j) => {
                  if (typeof cell === 'object') {
                    return (
                      <td key={j} className="px-4 py-2.5">
                        {cell.badge ? (
                          <Badge className={cn('text-xs border-0', cell.color)}>{cell.value}</Badge>
                        ) : (
                          <span className={cell.color}>{cell.value}</span>
                        )}
                      </td>
                    )
                  }
                  return <td key={j} className="px-4 py-2.5 text-sm">{cell}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
