import { fetchBedsById } from "@/lib/api"
import { Bed } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

export const useBeds = (body: {
  roomId: number
  startTime: string
  endTime: string
}) => {
  console.log("working useBeds", body)

  return useQuery<Bed[], Error>({
    queryKey: ["room", body.roomId, body.startTime, body.endTime],
    queryFn: () => fetchBedsById(body),
    // enabled: !!body.id, // The query will not run until the id is available
    // staleTime: 5 * 60 * 1000,
  })
}
