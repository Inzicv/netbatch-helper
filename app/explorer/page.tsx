import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MonitorFilters from "@/components/monitor-filters";
import JobCard from "@/components/job-card";
import HeaderCard from "@/components/header-card";
import ConfigCard from "@/components/config-card";
import PlanningCard from "@/components/planning-card";
import DependencyCard from "@/components/dependency-card";
import ObeyCard from "@/components/obey-card";

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <Header />

      <div className="grid grid-cols-12 gap-6 p-6">

        {/* Colonne gauche */}

        <div className="col-span-3 space-y-6">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <SearchBar />

            <div className="mt-6">

              <MonitorFilters />

            </div>

          </div>

          <div className="space-y-4">

            <JobCard
              selected
              jobName="ONTST03"
              script="\ISIS.$DEVT05.NETDCMD.ONTST03"
              user="90,1"
              monitor="$ZBAD"
            />

            <JobCard
              jobName="ONTST01"
              script="\ISIS.$DEVT05.NETDCMD.ONTST01"
              user="90,1"
              monitor="$ZBAD"
            />

          </div>

        </div>

        {/* Partie droite */}

        <div className="col-span-9 space-y-6">

          <HeaderCard
            jobName="ONTST03"
            monitor="$ZBAD"
            jobNumber={1438}
            user="90,1"
            description="Job de test standard"
          />

          <div className="grid grid-cols-2 gap-6">

            <ConfigCard
              volume="\ISIS.$DEVT05.NETDDTS"
              scriptIn="\ISIS.$DEVT05.NETDCMD.ONTST03"
              output="\ISIS.$VHNET"
              executor="\ISIS.$SYSTEM.SYS02.TACL"
              stopOnAbend="ON"
            />

            <PlanningCard
              every="1,31 * * * 1-5"
              translation={
                "Du lundi au vendredi\nToutes les heures\nAux minutes 1 et 31"
              }
              nextRun="19/06/2026 13:31"
            />

          </div>

          <DependencyCard
            waitFor={[]}
            blockedByThis={[]}
          />

          <ObeyCard
            obey={`ASSUME JOB

RESET

SET VOLUME \\ISIS.$DEVT05.NETDDTS

SET IN \\ISIS.$DEVT05.NETDCMD.ONTST03

SET OUT \\ISIS.$VHNET

SET EXECUTOR-PROGRAM \\ISIS.$SYSTEM.SYS02.TACL

SET EVERY 1,31 * * * 1-5

==CHANGEUSER 90,1

SUBMIT ONTST03`}
          />

        </div>

      </div>

    </div>
  );
}