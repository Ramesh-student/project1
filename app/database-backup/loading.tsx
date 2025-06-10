import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <div className="space-x-2">
                <Skeleton className="h-10 w-32 inline-block" />
                <Skeleton className="h-10 w-32 inline-block" />
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-px w-full my-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
